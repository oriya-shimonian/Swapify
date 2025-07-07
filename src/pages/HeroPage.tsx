import HeroMainSection from "@/components/Hero/HeroMainSection";
import Recommendations from "@/components/Hero/Recommendations";
import SomeProducts from "@/components/Hero/SomeProducts";
import WhySwapify from "@/components/Hero/WhySwapify";
import { useEffect } from "react";

const HeroPage = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <HeroMainSection />
      <WhySwapify />
      <SomeProducts />
      <Recommendations />
    </div>
  );
};

export default HeroPage;
