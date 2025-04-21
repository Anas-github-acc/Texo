"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";
 
export function HeroParallaxDemo() {
  return(
  <div className="bg-gray mt-0">
     <HeroParallax products={products} />
  </div>
  );
}
export const products = [
  {
    title: "Moon1beam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/1.svg",
  },
  {
    title: "Moonb2eam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/2.jpg",
  },
  {
    title: "Moonbe3am",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/3.jpg",
  },
  {
    title: "Moo4nbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/4.jpg",
  },

];