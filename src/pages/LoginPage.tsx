import { useAuth } from '@/context/AuthContext';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { socialLogin } = useSocialAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res = await login(email, password); // 🔹 ניסיון התחברות
      await checkAuth(); // 🔹 בדיקת התחברות לאחר ההתחברות
      if (res) navigate("/all-products"); // 🟢 מעבר לדף הבית
    } catch (error) {
      //
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-hidden`}>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl rounded-t-none p-8 "
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          ברוכים הבאים
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
        התחברו עם חשבון קיים או התחברו עם רשת חברתית
        </p>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <motion.button 
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 bg-transparent text-blue-600 border border-blue-600 py-3 rounded-lg hover:text-blue-700 hover:border-blue-700 transition-colors"
            onClick={() => socialLogin("facebook")}
          >
            <FaFacebook size={24} />
            התחברו עם Facebook
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 bg-transparent text-red-600 border border-red-600 py-3 rounded-lg hover:text-red-700 hover:border-red-700 transition-colors"
            onClick={() => socialLogin("google")}
          >
            <FaGoogle size={24} />
            התחברו עם Google
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400">או</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="האימייל שלך" 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          <input 
            type="password" 
            placeholder="הסיסמה שלך" 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          
          <motion.button 
            type="submit" 
            disabled={!email ||!password}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            התחברות
          </motion.button>
        </form>

        {/* לינק להרשמה עם עיצוב מיוחד */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <span className="ml-1">עוד אין לך חשבון?</span>
          <Link to="/signup" className="underline underline-offset-4 hover:text-gray-700 hover:dark:text-gray-300 transition-colors">
            נרשמים כאן
          </Link>
        </p>
        
      </motion.div>
    </div>
  );
};

export default LoginPage;