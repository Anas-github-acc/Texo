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
    title: "Collaboration",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/1.svg",
  },
  {
    title: "Better UI",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/2.svg",
  },
  {
    title: "Notification",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/3.svg",
  },
  {
    title: "Code Showcase",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/4.jpg",
  },

];