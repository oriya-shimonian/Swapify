import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardItem {
  label: string;
  value: number | string;
  color: "blue" | "green" | "red" | "purple" | "gray" | string;
  Icon: LucideIcon;
}

interface StatsCardsProps {
  items: StatsCardItem[];
  columns?: number; // default: 4
}

const StatsCards = ({ items, columns = 4 }: StatsCardsProps) => {
  return (
    <div className={`grid lg:grid-cols-${columns} md:grid-cols-2 sm:grid-cols-1 gap-6 mb-8`}>
      {items.map(({ label, value, color, Icon }) => (
        <div
          key={label}
          className={cn(
            "relative overflow-hidden text-center rounded-2xl p-6 transition-all duration-300 ease-in-out",
            "bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/20",
            "hover:-translate-y-1 hover:shadow-md",
            "hover:before:opacity-100 before:absolute before:inset-[-2px] before:rounded-2xl before:transition-opacity before:duration-300",
            "before:bg-gradient-to-br before:from-transparent before:via-white/20 dark:before:via-indigo-500/10 before:to-transparent"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
              <p className={cn("text-2xl font-bold", `text-${color}-600 dark:text-${color}-400`)}>
                {value}
              </p>
            </div>
            <div className={cn(`p-3 rounded-full bg-${color}-100 dark:bg-${color}-800/30`)}>
              <Icon className={cn("w-6 h-6", `text-${color}-600 dark:text-${color}-300`)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
