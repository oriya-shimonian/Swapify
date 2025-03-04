// import { Link } from 'react-router-dom';

// export default function NotFoundPage() {
//     return (
//         <div className="flex items-center justify-center min-h-[80vh] bg-white dark:bg-gray-900">
//           <div className="max-w-md p-8 shadow-lg rounded-lg bg-white dark:bg-gray-800">
//             <h2 className="text-3xl font-bold mb-4 text-center">404 - Page Not Found</h2>
//             <p className="text-gray-700 dark:text-gray-400 text-center">Sorry, the page you are looking for could not be found.</p>
//             <Link className="font-semibold text-center underline mx-auto block mt-5" to={"/"}>Go Home</Link>
//           </div>
//         </div>
//       );
// }
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl rounded-t-none p-8 text-center"
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                    404
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    מצטערים, העמוד שחיפשת לא נמצא
                </p>
                
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link 
                        to="/" 
                        className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        חזרה לדף הבית
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}