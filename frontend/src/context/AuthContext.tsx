import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { authRoutes } from "@/settings";
import { IUser } from "@/types/type";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "@/lib/socket";

// סוגי הפעולות ל-Reducer
type AuthAction =
  | { type: "LOGIN"; payload: { user: any; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

// מבנה הסטייט
type AuthState = {
  user: any | null;
  token: string | null;
  loading: boolean;
};

// סטייט התחלתי
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
};

// Reducer לניהול מצבי ההתחברות
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// יצירת ה-Context
const AuthContext = createContext<{
  user: IUser | null;
  state: AuthState;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
} | null>(null);

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
 
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(authRoutes.login, { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch({ type: "LOGIN", payload: { user, token } });
      console.log("User logged in:", user);
      
      // 🧠 התחברות ל־Socket אחרי login
      connectSocket(user.user_id);
    } catch (error: any) {
      console.log("Login error:", error.status);
      if(error.status === 403) {
        toast.error("המשתמש נחסם. פנה למנהל המערכת.");
        return;
      }
      if (error.response) {
        toast.error(
          `שגיאה: ${error.response.data.message || "ניסיון ההתחברות נכשל"}`
        );
      } else {
        toast.error("אירעה שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
      }
    }
  };

  // פונקציה להתנתקות
  const logout = () => {
    console.log("Logging out...");

    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    disconnectSocket(); // ❌ ניתוק מה־Socket

    dispatch({ type: "LOGOUT" });
  };

  // בדיקה אם המשתמש מחובר
  const checkAuth = async () => {
    // if (!localStorage.getItem("token")) {
    //   return;
    // }
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await axios.get(authRoutes.checkAuth, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data, "response");
      const user = response.data.user;

      dispatch({
        type: "LOGIN",
        payload: {
          user,
          token: localStorage.getItem("token")!,
        },
      });
      connectSocket(user.user_id);
    } catch (error) {
      logout();
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: state.user, loading: state.loading, state, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook לשימוש ב-AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
