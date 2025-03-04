import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import ButtonLink from "@/components/ButtonLink";
import { NAV_LINKS } from "@/constants/navigationLinks";
const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // bg-white dark:bg-gray-900
    <nav className="fixed top-0 right-0 w-full bg-gray-100/15 dark:bg-black/30 shadow-md transition-all duration-300 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center ">
        {/* צד שמאל - מצב אור/חושך + כניסה */}
        <div className="flex items-center space-x-4">
          {/* <Link
            to="/login"
            className="px-6 py-2 rounded-lg text-white font-semibold text-lg shadow-lg transition-all duration-300
            bg-gradient-to-r from-blue-500 to-indigo-600
            dark:from-blue-700 dark:to-indigo-800
            hover:shadow-xl hover:scale-x-105"
          >
            כניסה
          </Link> */}
          <ButtonLink to="/login">כניסה</ButtonLink>

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

          {/* כפתור תפריט למובייל */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* תפריט ניווט - מוצג במחשב */}
        <div className="hidden md:flex space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-black dark:text-gray-300 hover:text-primary transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* לוגו + שם האפליקציה */}
        <div className="flex items-center space-x-3">
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
        </div>
      </div>

      {/* תפריט למובייל */}
      {/* {isMenuOpen && (
        <motion.div
          className="md:hidden flex flex-col bg-white dark:bg-gray-900 shadow-lg absolute top-16 right-0 w-full p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/explore"
            className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
            onClick={() => setIsMenuOpen(false)}
          >
            חיפוש פריטים
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
            onClick={() => setIsMenuOpen(false)}
          >
            עלינו
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 text-center rounded-lg transition"
            onClick={() => setIsMenuOpen(false)}
          >
            צור קשר
          </Link>
        </motion.div>
      )} */}
      {/* תפריט למובייל */}
      {isMenuOpen && (
        <motion.div
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
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
