import type { LucideIcon } from "lucide-react";

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

const ManageUsersStatsCards = ({ items, columns = 4 }: StatsCardsProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 mb-8`}>
      {items.map(({ label, value, color, Icon }) => (
        <div
          key={label}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            </div>
            <div className={`p-3 bg-${color}-100 rounded-full`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageUsersStatsCards;
