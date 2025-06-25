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
import { NotificationsProvider } from "./context/NotificationsContext";
import ChatPage from "./pages/ChatPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminLayout from "./pages/Admin/AdminLayout";
import FancyBackground from "./components/FancyBackground";
import AdminStatisticsPage from "./pages/Admin/AdminStatisticsPage";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile";
    const publicRoutes = ['/', '/explore', '/login', '/signup', '/all-products', '/product', '/about', '*'];

    console.log("Current location:", location.pathname);
    
  const AppLayout = (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      <FancyBackground />
      <Navbar />

      <main className={`flex-grow ${hideFooter ? "pb-0" : "pb-6"}`}>
        {loading && !publicRoutes.some(route => location.pathname.startsWith(route)) ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-500 dark:text-gray-300 mt-8">
            <img src="/logo-without bg.png" className="h-52 sm:h-28 animate-bounce mb-3 mt-40" alt="טוען..." />
          </div>
        ) : (
          <Routes>
            {/* עמודים ציבוריים */}
            <Route path="/" element={!user ? <HeroPage /> : <HomePage />} />
            <Route path="/explore" element={<HeroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/all-products" element={<HomePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* עמודים שדורשים משתמש */}
            {user && (
              <>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/add-product" element={<AddProductPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/dashboard" element={<UserDashboardWrapper />}>
                  <Route path="my-products" element={<MyProductsTab />} />
                  <Route path="requests/sent" element={<MySentRequestsTab />} />
                  <Route path="requests/received" element={<MyReceivedRequestsTab />} />
                </Route>
                <Route path="/notifications" element={<NotificationsPage />} />

                {/* עמודי אדמין */}
                {user.role_name === "Admin" && (
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="audits" element={<AuditLogsPage />} />
                    <Route path="stats" element={<AdminStatisticsPage />} />
                  </Route>
                )}
              </>
            )}
          </Routes>
        )}
      </main>

      {!hideFooter && <Footer design="" />}
    </div>
  );

  return user ? (
    <NotificationsProvider user={user}>{AppLayout}</NotificationsProvider>
  ) : (
    AppLayout
  );
}


export default App;
