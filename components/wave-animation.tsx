"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface WaveAnimationProps {
  className?: string
}

export function WaveAnimation({ className = "" }: WaveAnimationProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default colors for light mode
  let waveColor1 = "rgba(20, 184, 166, 0.1)" // teal with opacity
  let waveColor2 = "rgba(20, 184, 166, 0.05)" // lighter teal with opacity

  // Colors for dark mode
  if (mounted && resolvedTheme === "dark") {
    waveColor1 = "rgba(45, 212, 191, 0.05)" // dark mode teal with opacity
    waveColor2 = "rgba(45, 212, 191, 0.03)" // lighter dark mode teal with opacity
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* First wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path id="wave-path-1" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="wave-animation-1">
            <use xlinkHref="#wave-path-1" x="50" y="0" fill={waveColor1} />
          </g>
        </svg>
      </div>

      {/* Second wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path id="wave-path-2" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="wave-animation-2">
            <use xlinkHref="#wave-path-2" x="50" y="3" fill={waveColor2} />
          </g>
        </svg>
      </div>

      {/* Third wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-20">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path id="wave-path-3" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="wave-animation-3">
            <use xlinkHref="#wave-path-3" x="50" y="5" fill={waveColor1} />
          </g>
        </svg>
      </div>
    </div>
  )
}
