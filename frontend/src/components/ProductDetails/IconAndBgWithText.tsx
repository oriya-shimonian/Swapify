import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  Icon: LucideIcon;
  color: string;
  label: string;
  value: React.ReactNode;
  design?: string;
  valueDesign?: string; 
}

const IconAndBgWithText = ({ Icon, color, label, value, design, valueDesign }: InfoItemProps) => {
  const iconClasses = `text-${color}-600 bg-${color}-100`;

  return (
    <div className="flex items-center gap-3">
      <Icon size={35} className={`rounded-lg p-2 ${iconClasses}`} />
      <div>
        <p className={`text-sm text-gray-500 ${design}`}>{label}</p>
        <p className={`font-semibold text-gray-800 ${valueDesign}`}>{value}</p>
      </div>
    </div>
  );
};

export default IconAndBgWithText;
