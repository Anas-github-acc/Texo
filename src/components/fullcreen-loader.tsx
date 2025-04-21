"use client"

import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FullscreenLoaderProps {
  label?: string
  className?: string
}

export const FullscreenLoader = ({ label, className }: FullscreenLoaderProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div className="relative">
        {/* Glow effect behind the loader */}
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />

        {/* Animated loader with custom styling */}
        <motion.div
          className="relative bg-gray-800/80 backdrop-blur-sm rounded-full p-6 border border-gray-700/30 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoaderIcon className="size-8 text-purple-400 animate-spin" />
        </motion.div>
      </div>

      {label && (
        <motion.p
          className="text-sm font-medium text-gray-300 max-w-[250px] text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {label}
        </motion.p>
      )}

      {/* Subtle animated dots */}
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-purple-400/70"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 1.5,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
