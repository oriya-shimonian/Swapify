import React from "react";
import { cn } from "@/lib/utils";

// interface GlassCardProps {
//   icon?: React.ReactNode;
//   title: string;
//   description: string | React.ReactNode;
//   className?: string;
// }
interface GlassCardProps {
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ icon, title, description, className }) => {
  return (
    <div
      className={cn(
        "w-full max-w-xs sm:max-w-sm mx-auto", // ✨ תמיכה במובייל
        "relative overflow-hidden text-center rounded-2xl p-7 transition-all duration-300 ease-in-out",
        "bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-2 hover:bg-white/10",
        "hover:before:opacity-100 before:absolute before:inset-[-2px] before:rounded-2xl before:transition-opacity before:duration-300",
        "before:bg-gradient-to-br before:from-transparent before:via-indigo-500/10 before:to-transparent",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center rounded-xl">
          {icon}
        </div>
      )}
      <h3 className="text-black dark:text-white text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default GlassCard;
