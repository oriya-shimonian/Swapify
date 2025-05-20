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

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile";

  const AppLayout = (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      <Navbar />
      <main className={!hideFooter ? `min-h-[84vh]` : ""}>
        <Routes>
          {/* Always available routes */}
          <Route path="/" element={!user ? <HeroPage /> : <HomePage />} />
          <Route path="/explore" element={<HeroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/all-products" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Routes that require a user */}
          {user && (
            <>
              <Route
                path="/admin/audits"
                element={user.role_name === "Admin" ? <AuditLogsPage /> : <HomePage />}
              />
              <Route path="/dashboard" element={<UserDashboardWrapper />}>
                <Route path="my-products" element={<MyProductsTab />} />
                <Route path="requests/sent" element={<MySentRequestsTab />} />
                <Route path="requests/received" element={<MyReceivedRequestsTab />} />
              </Route>
              <Route path="/notifications" element={<NotificationsPage />} />
            </>
          )}
        </Routes>
      </main>
      {!hideFooter && <Footer design="" />}
    </div>
  );

  // ✅ כאן עוטפים את כל המבנה רק אם יש user – ואז הכל (כולל Navbar) יקבל context
  return user ? (
    <NotificationsProvider user={user}>{AppLayout}</NotificationsProvider>
  ) : (
    AppLayout
  );
}


export default App;
