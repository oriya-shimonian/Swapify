import { Link } from "react-router-dom";

interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const ButtonLink = ({ to, children, className = "" }: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className={`text-center px-6 py-2 rounded-lg text-white font-semibold text-lg shadow-lg transition-all duration-300
      bg-gradient-to-r from-blue-500 to-indigo-600 
      dark:from-blue-700 dark:to-indigo-800 
      hover:shadow-xl hover:scale-x-105 ${className}`}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
