import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "./providers/ThemeProvider";
import HeroPage from "./pages/HeroPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import Footer from "./components/footer";
import HomePage from "./pages/HomePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./components/ProductDetailPage";
// import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import Explore from "@/pages/Explore";
// import Login from "@/pages/Login";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/profile";
  const addDesignToFooter = location.pathname !== "/";

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
        <Navbar />
        <main className={!hideFooter ? `min-h-[84vh]` : ""}>
          <Routes>
            <Route path="/" element={!user ? <HeroPage /> : <HomePage />} />
            {/*<Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/explore" element={<Explore />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/all-products" element={<HomePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!hideFooter && (
          <Footer design="" />
        )}
      </div>
    </>
  );
}

export default App;
