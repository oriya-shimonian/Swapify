import { useAuth } from "@/context/AuthContext";
import { NAV_LINKS, USER_LINKS, ADMIN_LINKS } from "@/constants/navigationLinks";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer({ design }: { design?: string }) {
  const { user, loading } = useAuth();

  const linksToShow = [
    ...NAV_LINKS,
    ...(user ? USER_LINKS : []),
    ...(user?.role_name === "Admin" ? ADMIN_LINKS : []),
  ];

  return (
    <footer className={`${design || ""} w-full border-t p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">

        {/* לוגו */}
        <motion.img
          src="/logo-without bg.png"
          alt="הלוגו של SWAPIFY"
          className="h-8 md:h-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* קישורים */}
        <div className="flex flex-wrap justify-center gap-4">
          {linksToShow.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:underline hover:text-black dark:hover:text-white transition text-sm"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* מייל ליצירת קשר */}
        <div className="text-sm text-center">
          ניתן לפנות אלינו במייל:{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=swapify418@gmail.com&subject=פנייה מהאתר Swapify&body=שלום, אשמח לעזרה בנושא..."
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black dark:hover:text-white"
          >
            swapify418@gmail.com
          </a>
        </div>
      </div>

      {/* זכויות יוצרים */}
      <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        כל הזכויות שמורות © Swapify 2025
      </div>
    </footer>
  );
}
