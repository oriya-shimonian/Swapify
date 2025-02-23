import { Feature } from "../types/type"; // ייבוא ה-Type

const FeatureCard = ({ icon, title, description }: Feature) => (
  <div className="flex flex-col items-center text-center">
    {icon}
    <h4 className="text-2xl font-semibold mt-4 text-right">{title}</h4>
    <p className="text-gray-600 dark:text-gray-400 text-base mt-2 mr-5 max-w-xs text-right">{description}</p>
  </div>
);

export default FeatureCard;
