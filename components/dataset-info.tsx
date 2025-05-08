"use client"

import { useEffect, useRef } from "react"

export function DatasetInfo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Check if dark mode
    const isDarkMode = document.documentElement.classList.contains("dark")
    const bgColor = isDarkMode ? "#1e293b" : "#f8fafc"
    const textColor = isDarkMode ? "#e2e8f0" : "#334155"

    // Colors
    const colors = {
      teal: "#14b8a6",
      amber: "#f59e0b",
      indigo: "#6366f1",
      red: "#ef4444",
      green: "#22c55e",
      blue: "#3b82f6",
      purple: "#a855f7",
    }

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Draw pie chart for dataset composition
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    // Dataset composition
    const data = [
      { label: "Training", value: 70, color: colors.teal },
      { label: "Validation", value: 15, color: colors.amber },
      { label: "Test", value: 15, color: colors.indigo },
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie slices
    let startAngle = 0
    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw slice border
      ctx.strokeStyle = bgColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(labelAngle)
      const labelY = centerY + labelRadius * Math.sin(labelAngle)

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.value}%`, labelX, labelY)

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 100
    const legendY = 20
    const legendItemHeight = 20

    data.forEach((item, i) => {
      const y = legendY + i * legendItemHeight

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(item.label, legendX + 20, y + 6)
    })

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("Dataset Split", width / 2, 10)

    // Draw demographic information
    const demoX = 20
    const demoY = height - 80
    ctx.fillStyle = textColor
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Demographics:", demoX, demoY)

    ctx.font = "12px Arial"
    ctx.fillText("Age: 18-89 years (mean 61.2)", demoX, demoY + 20)
    ctx.fillText("Gender: 54% male, 46% female", demoX, demoY + 40)
    ctx.fillText("Hospital settings: ICU, ED, General wards", demoX, demoY + 60)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[200px] rounded-lg" />
}
