"use client";

import { HeroSection } from "@/components/storefront/HeroSection";
import {
  FeaturedProducts,
  NewArrivals,
  CategoriesSection,
  FeaturesBar,
  CtaBanner,
} from "@/components/storefront/HomeSections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <FeaturedProducts />
      <CategoriesSection />
      <NewArrivals />
      <CtaBanner />
    </>
  );
}
