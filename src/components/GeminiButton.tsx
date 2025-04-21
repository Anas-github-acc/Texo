"use client"

import { useState } from "react"

interface GeminiButtonProps {
  onClick: () => void
}

export default function GeminiButton({ onClick }: GeminiButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <div className={`transition-all duration-300 ${isHovered ? "scale-110" : "scale-100"}`}>
          <span>G</span>
        </div>
      </div>
    </button>
  )
}