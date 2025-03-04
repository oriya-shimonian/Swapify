import { NAV_LINKS } from "@/constants/navigationLinks";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Footer({design}: {design: string}) {
  return (
    <footer className={`${design} w-full border-t p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* לוגו */}
        <div className="text-2xl font-semibold">
        <motion.img
            src="/logo-without bg.png"
            alt="הלוגו של SWAPIFY"
            className="lg:h-10 md:h-8 sm:h-4 h-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* קישורים */}
        <div className="flex space-x-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="hover:text-black dark:hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* אייקונים חברתיים */}
        <div className="flex space-x-4 text-2xl">
          <FaFacebook className="cursor-pointer hover:text-blue-600" />
          <FaInstagram className="cursor-pointer hover:text-pink-500" />
          <FaXTwitter className="cursor-pointer hover:text-gray-700" />
          <FaLinkedin className="cursor-pointer hover:text-blue-700" />
          <FaYoutube className="cursor-pointer hover:text-red-600" />
        </div>
      </div>

      {/* זכויות יוצרים */}
      <div className="text-center mt-4 text-sm">
         2025 Swapify כל הזכויות שמורות ©
        {/* TODO */}
        {/* <a href="/privacy-policy" className="ml-2 underline hover:text-black dark:hover:text-white">Privacy Policy</a>
        <a href="/terms-of-service" className="ml-2 underline hover:text-black dark:hover:text-white">Terms of Service</a>
        <a href="/cookies-settings" className="ml-2 underline hover:text-black dark:hover:text-white">Cookies Settings</a> */}
      </div>
    </footer>
  );
}
