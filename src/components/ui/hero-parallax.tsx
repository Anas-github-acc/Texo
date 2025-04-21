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
          <span className="text-blue-300 text-7xl">Better Document </span>
          <span className="text-6xl text-[#f2f2f2]">Collaborate without chaos</span>
        </div>
        <p className="max-w-full text-[#f2f2f2]/90 md:text-xl mt-5 text-center ">
          Collaborative, seamless conflict resolution, and multi-user workflows <br/> built for teams who can't afford to lose data
        </p>
        <div className="mt-8 items-center justify-center flex gap-3">
          <Button onClick={handleGetStarted} className="px-6 py-6  text-black/70 bg-[#f2f2f2] hover:bg-[#f2f2f2]/70 rounded-sm shadow-lg transition-all duration-300 font-bold cursor-pointer">
            Get Started
          </Button>
          <Button className="px-6 py-6  text-[#ffffff]/70 bg-[#1b1b1b] hover:bg-[#fff]/1 rounded-sm transition-all duration-300 font-normal border border-[#ffffff]/10 cursor-pointer">
            Docs
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
      title: "Conflict Resolution for Enhanced Control",
      description: [
        {
          main: "Mitigating Data Loss:",
          sub: "Traditional spreadsheets permit concurrent edits without robust conflict resolution, increasing the risk of unintended data overwrites. Implementing an author approval mechanism ensures that conflicting changes are reviewed before finalization, thereby preserving data integrity.",
        }
      ],
      image: "/1.svg",
    },
    {
      id: "2", // Add ID for the feature
      title: "Version Control for Greater Accountability",
      description: [
        {
          main: "• Comprehensive Change Tracking:",
          sub: "Every modification is recorded in a structured commit system, allowing users to track edits with full transparency.",
        },
        {
          main: "• Facilitates Rollbacks & Audit Trails:",
          sub: "Essential for teams managing critical datasets, enabling precise error identification and resolution.",
        },
        {
          main: "Minimizing Spreadsheet Errors:",
          sub: "Studies indicate that 88% to 94% of business spreadsheets contain errors. Implementing structured version control significantly enhances data accuracy and reliability.",
        }
      ],
      image: "/2.svg",
    },
    {
      id: "3", // Add ID for the feature
      title: "Optimized for Multi-User Collaboration",
      description: [
        {
          main: "• Ensuring Accuracy Before Merging:",
          sub: "In fields such as finance, legal documentation, and software planning—where accuracy is paramount—our system verifies changes before integration.",
        },
        {
          main: "Addressing High-Stakes Spreadsheet Risks:",
          sub: "Spreadsheet inaccuracies have resulted in substantial financial losses. Notably, JPMorgan Chase suffered a $6 billion trading loss in 2012 due in part to spreadsheet errors.",
        }
      ],
      image: "/3.svg",
    },
    {
      id: "4", // Add ID for the feature
      title: "Flexible Data Handling for Organizational Needs",
      description: [
        {
          main: "Adaptive Hierarchical Customization:",
          sub: "Traditional spreadsheets lack the flexibility to enforce role-based editing priorities. Our system allows organizations to implement custom merge strategies, ensuring that high-level approvals align with operational workflows.",
        }
      ],
      image: "/4.jpg",
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
              className="w-[500px] rounded-lg shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

