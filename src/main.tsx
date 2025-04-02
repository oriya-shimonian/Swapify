import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <AuthProvider>
        <Router>
          <App />
          <Toaster />
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </ThemeProvider>
);
