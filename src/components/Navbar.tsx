import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import {
  ADMIN_LINKS,
  NAV_LINKS,
  USER_LINKS,
} from "@/constants/navigationLinks";
import { useAuth } from "@/context/AuthContext";
import NotificationsDropdown from "./notifications/NotificationsDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import AppButton from "./Buttons/AppButton";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useClickOutside(menuRef, () => setIsMenuOpen(false));
  useClickOutside(profileRef, () => setIsProfileMenuOpen(false));

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 right-0 w-full bg-white/70 backdrop-blur-sm dark:bg-zinc-900/70
 shadow-md transition-all duration-300 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* לוגו + שם האפליקציה */}
        <div className="flex items-center space-x-reverse space-x-3">
          <Link
            to={`${user ? "/all-products" : "/explore"}`}
            className="flex items-center space-x-reverse space-x-3"
          >
            <span className="lg:text-xl sm:text-md font-bold text-gray-900 dark:text-white">
              SWAPIFY
            </span>
            <motion.img
              src="/logo-without bg.png"
              alt="הלוגו של SWAPIFY"
              className="lg:h-10 md:h-8 sm:h-4 h-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </Link>
        </div>

        {/* תפריט ניווט - מוצג במחשב */}
        <div className="hidden md:flex space-x-reverse space-x-6 ">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-black dark:text-gray-300 hover:text-primary transition"
            >
              {link.name}
            </Link>
          ))}

          {user &&
            USER_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-black dark:text-gray-300 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

          {user &&
            user.role_name === "Admin" &&
            ADMIN_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-black dark:text-gray-300 hover:text-primary transition"
              >
                {link.name}
              </Link>
            ))}
        </div>

        {/* צד שמאל - מצב אור/חושך + כניסה/תפריט משתמש */}
        <div className="flex items-center space-x-4 relative">
          {/* כפתור תפריט למובייל */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* כפתור מצב אור/חושך */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="sm:h-4 sm:w-4 lg:w-5 lg:h-5 text-yellow-400" />
            ) : (
              <Moon className="sm:h-4 sm:w-4 lg:w-5 lg:h-5 text-gray-500" />
            )}
          </button>
          {/* כפתור התראות */}
          {user && <NotificationsDropdown />}
          {/* כפתור כניסה\תפריט משתמש */}
          {user ? (
            // 🟢 תפריט למשתמש מחובר
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <span className="bg-gradient-to-r from-blue-400 to-indigo-800 dark:from-blue-300 dark:to-indigo-500 inline-block text-transparent bg-clip-text">
                  {user.name} ,שלום
                </span>
              </button>

              {isProfileMenuOpen && (
                <motion.div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    פרופיל
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    יציאה
                  </Link>
                </motion.div>
              )}
            </div>
          ) : (
            // 🔹 כפתור "כניסה" אם המשתמש לא מחובר
            <AppButton onClick={() => navigate("/login")} className="text-lg">כניסה</AppButton>
          )}
        </div>
      </div>

      {/* תפריט למובייל */}
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          className="mt-3 md:hidden flex flex-col bg-gray-100/15 dark:bg-black/30 shadow-lg absolute top-16 right-0 w-full p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user &&
            USER_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

          {user &&
            user.role_name === "Admin" &&
            ADMIN_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
              >
                {link.name}
              </Link>
            ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
