import CoverAnimation from "@/components/CoverAnimation";
import HeroMainSection from "@/components/Hero/HeroMainSection";
import Recommendations from "@/components/Hero/Recommendations";
import SomeProducts from "@/components/Hero/SomeProducts";
import WhySwapify from "@/components/Hero/WhySwapify";
import { useEffect, useState } from "react";
// import HeroSection from "@/components/explore/HeroSection";
// import PuzzleTransition from "@/components/explore/PuzzleTransition";
// import FeaturesSection from "@/components/explore/FeaturesSection";
// import ProductShowcase from "@/components/explore/ProductShowcase";
// import Testimonials from "@/components/explore/Testimonials";
// import CallToAction from "@/components/explore/CallToAction";

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
      {/* <FeaturesSection />
      <ProductShowcase />
      <Testimonials />
      <CallToAction /> */}
    </div>
  );
};

export default HeroPage;
