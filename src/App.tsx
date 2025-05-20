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
import { useAuth } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/Products/ProductDetailPage";
import AddProductPage from "./pages/Products/AddProductPage";
import AboutPage from "./pages/AboutPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import UserDashboardWrapper from "./pages/UserDashboardPage";
import MyProductsTab from "./components/UserDashboard/MyProductsTab";
import MySentRequestsTab from "./components/UserDashboard/MySentRequestsTab";
import MyReceivedRequestsTab from "./components/UserDashboard/ReceivedRequestsTab";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile";
  const addDesignToFooter = location.pathname !== "/";

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
        <Navbar />
        <main className={!hideFooter ? `min-h-[84vh]` : ""}>
          <Routes>
            <Route path="/" element={!user ? <HeroPage /> : <HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/audits" element={user && user.role_name === "Admin" ? <AuditLogsPage /> : <HomePage/>} />
             <Route path="/dashboard" element={user ? <UserDashboardWrapper /> : <HomePage />}>
              <Route path="my-products" element={user ? <MyProductsTab /> : <HomePage />} />
              <Route path="requests/sent" element={user ? <MySentRequestsTab />: <HomePage />} />
              <Route path="requests/received" element={user ? <MyReceivedRequestsTab />: <HomePage />} />
            </Route> 
            <Route path="/notifications" element={user ? <NotificationsPage user={user} /> : <HomePage />} />

            {/* <Route path="/contact" element={<Contact />} />*/}
            <Route path="/explore" element={<HeroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/all-products" element={<HomePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!hideFooter && <Footer design="" />}
      </div>
    </>
  );
}

export default App;
