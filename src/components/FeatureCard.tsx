import { Feature } from "../types/type"; // ייבוא ה-Type

const FeatureCard = ({ icon, title, description }: Feature) => (
  <div className="flex flex-col items-center text-center">
    {icon}
    <h4 className="lg:text-2xl md:text-lg font-semibold lg:mt-4 md:mt-2 text-right">{title}</h4>
    <p className="md:text-sm text-gray-600 dark:text-gray-400 lg:text-base mt-2 mr-5 max-w-xs text-right">{description}</p>
  </div>
);

export default FeatureCard;
