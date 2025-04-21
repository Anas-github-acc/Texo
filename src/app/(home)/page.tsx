'use client'

import { HeroParallaxDemo } from "@/components/herosection";
import { Navbar } from "@/components/navbar"
export default function Home() {

  
  return (
    <div className=" bg-[#1B1B1B] h-full w-full flex flex-col  ">
      <Navbar />
   
        <HeroParallaxDemo />
    
    </div>
  );
}
