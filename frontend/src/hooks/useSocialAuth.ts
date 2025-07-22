import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { signInWithSocial } from "@/lib/firebaseSocial";
import { useAuth } from "@/context/AuthContext";
import { connectSocket } from "@/lib/socket";
import { authRoutes } from "@/settings";

/**
 * Hook להתחברות עם Google או Facebook באמצעות Firebase ואימות בשרת
 */
export const useSocialAuth = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const socialLogin = async (provider: "google" | "facebook") => {
    try {
      const { idToken } = await signInWithSocial(provider);
        console.log(`Social login with ${provider} successful, ID Token:`, idToken);
        
      const response = await axios.post(authRoutes.firebaseLogin, { token: idToken });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // התחברות ל־Socket כמו בלוגין רגיל
      connectSocket(user.user_id);

      // עדכון Context דרך checkAuth (ישלוף מהשרת ויעדכן את ה־user)
      await checkAuth();

      navigate("/all-products");
    } catch (err) {
      console.error(err);
      toast.error("התחברות נכשלה");
    }
  };

  return { socialLogin };
};
