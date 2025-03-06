import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <App />
        <Toaster />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);
