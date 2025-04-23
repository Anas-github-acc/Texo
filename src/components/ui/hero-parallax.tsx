"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import Image from "next/image";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(3, 6);
  const thirdRow = products.slice(6, 10);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-2200, 100]),
    springConfig
  );
  
  return (
    <div
      ref={ref}
      className="h-[410vh] py-40 max-w-screen overflow-hidden antialiased relative bg-[#1f1f1f] flex flex-col self-auto [perspective:2000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div
          className="flex flex-row-reverse space-x-reverse space-x-20 mb-20"
          animate={{ x: [0, -1000, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div
          className="flex flex-row mb-20 bg-[#1f1f1f] space-x-20"
          animate={{ x: [0, 1000, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div
          className="flex flex-row-reverse space-x-reverse space-x-20"
          animate={{ x: [0, -1000, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const router =useRouter();
  const handleGetStarted = () => {
    router.push("/dashboard");
  }
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-6 px-4 w-full text-left">
      <div className="bg-[#1f1f1f] rounded-md p-8 md:p-16 relative z-50 gap-5 flex flex-col items-center justify-center">
        <div className="flex flex-col text-2xl md:text-7xl font-bold text-[#f2f2f2] text-center gap-5">
          <span className="text-blue-300 text-7xl">Better Document And Interpreter </span>
          <span className="text-6xl text-[#f2f2f2]">Collaborate without chaos</span>
        </div>
        <p className="max-w-full text-[#f2f2f2]/90 md:text-xl mt-5 text-center ">
          Collaborative, seamless conflict resolution, and multi-user workflows <br/> built for teams who can't afford to lose data
        </p>
        <div className="mt-8 items-center justify-center flex gap-3">
          <Button onClick={handleGetStarted} className="px-6 py-6  text-black/70 bg-[#f2f2f2] hover:bg-[#f2f2f2]/70 rounded-sm shadow-lg transition-all duration-300 font-bold cursor-pointer">
            Get Started
          </Button>
         
        </div>
      </div>
     <AIApplicationSection/>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
        scale: 1.05,
      }}
      key={product.title}
      className="group/product h-96 w-[40rem] relative shrink-0 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="absolute inset-0 flex items-end p-4 z-30 bg-transparent">
        <h2 className="text-white text-2xl font-bold drop-shadow-lg">
          {product.title}
        </h2>
      </div>
      <Image
        src={product.thumbnail}
        height="800"
        width="1200"
        className="object-cover object-center absolute h-full w-full inset-0 z-10"
        alt={product.title}
        priority={true}
        unoptimized={true}
      />
    </motion.div>
  );
};

import Link from "next/link";


export default function AIApplicationSection() {
  const features = [
    {
      id: "1", // Add ID for the feature
      title: "Real-time Collaborative Editing",
      description: [
        {
          main: "Seamless Teamwork:",
          sub: "Multiple users can edit documents simultaneously with changes appearing instantly. See who's working where with cursor presence indicators and user attribution for all edits.",
        }
      ],
      image: "/5.jpg",
    },
    {
      id: "2", // Add ID for the feature
      title: "Cloud-based Document Storage",
      description: [
        {
          main: "• Automatic Saving:",
          sub: "Never lose work with continuous auto-saving that captures every change.",
        },
        {
          main: "• Access Anywhere:",
          sub: "Access your documents from any device with an internet connection.",
        },
        {
          main: "• Secure Backup:",
          sub: "Documents are securely stored in the cloud, eliminating the risk of local device failures.",
        }
      ],
      image: "/6.jpg",
    },
    {
      id: "3", // Add ID for the feature
      title: "Comprehensive Formatting Tools",
      description: [
        {
          main: "• Rich Text Editing:",
          sub: "Format text with various fonts, sizes, colors, and styles to create professional-looking documents.",
        },
        {
          main: "• Style Consistency:",
          sub: "Apply consistent document styling with customizable templates and style guides.",
        }
      ],
      image: "/7.jpg",
    },
    {
      id: "4", // Add ID for the feature
      title: "Advanced Sharing & Permissions",
      description: [
        {
          main: "Granular Access Control:",
          sub: "Share documents with specific permissions—view only, comment, or edit. Set individual or group access levels to maintain document security while enabling collaboration.",
        }
      ],
      image: "/8.jpg",
}
];


  return (
    <div className="bg-[#1f1f1f] text-white py-24 px-10 space-y-24">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex flex-col lg:flex-row items-center justify-between ${
            index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          } space-y-10 lg:space-y-0`}
        >
          {/* Text Section */}
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white">{feature.title}</h2>
            <ul className="mt-4 space-y-4 text-gray-400 text-justify">
              {feature.description.map((point, i) => (
                <li key={i}>
                  <strong className="text-white">{point.main}</strong>{" "}
                  {point.sub && <span>{point.sub}</span>}
                </li>
              ))}
            </ul>
            <Link href={`/blog/${feature.id}`}>
              <button className="mt-6 px-6 py-3 bg-black/25 text-gray-400 font-semibold rounded-lg hover:bg-[#2f2f2f] border border-gray-600 transition">
                Learn More<ArrowRight className="inline ml-2 size-4" />
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="relative mt-10 ml-20 mr-20 lg:mt-0">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-[800px] rounded-lg shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

