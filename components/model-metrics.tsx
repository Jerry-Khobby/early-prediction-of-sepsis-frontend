"use client"

import { useEffect, useRef } from "react"

export function ModelMetrics() {
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
    const gridColor = isDarkMode ? "#475569" : "#cbd5e1"

    // Colors
    const colors = {
      teal: "#14b8a6",
      amber: "#f59e0b",
      indigo: "#6366f1",
      red: "#ef4444",
    }

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Draw ROC curve
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const padding = 40
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding

    // Draw axes
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw grid
    ctx.setLineDash([5, 5])
    for (let i = 1; i <= 5; i++) {
      const x = padding + (i * graphWidth) / 5
      const y = height - padding - (i * graphHeight) / 5

      // Vertical grid line
      ctx.beginPath()
      ctx.moveTo(x, height - padding)
      ctx.lineTo(x, padding)
      ctx.stroke()

      // Horizontal grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw diagonal reference line
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, padding)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw ROC curve
    const rocPoints = [
      [0, 0],
      [0.05, 0.4],
      [0.1, 0.6],
      [0.2, 0.75],
      [0.3, 0.85],
      [0.4, 0.9],
      [0.6, 0.95],
      [0.8, 0.98],
      [1, 1],
    ]

    ctx.strokeStyle = colors.teal
    ctx.lineWidth = 3
    ctx.beginPath()
    rocPoints.forEach(([x, y], i) => {
      const canvasX = padding + x * graphWidth
      const canvasY = height - padding - y * graphHeight

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    })
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = textColor
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // X-axis label
    ctx.fillText("False Positive Rate", width / 2, height - padding / 2)

    // Y-axis label (rotated)
    ctx.save()
    ctx.translate(padding / 2, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("True Positive Rate", 0, 0)
    ctx.restore()

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("ROC Curve (AUC = 0.92)", width / 2, padding / 2)

    // Draw metrics table
    const metrics = [
      { name: "Accuracy", value: "92.7%" },
      { name: "Sensitivity", value: "89.3%" },
      { name: "Specificity", value: "94.1%" },
      { name: "PPV", value: "83.6%" },
      { name: "NPV", value: "96.5%" },
      { name: "F1 Score", value: "0.86" },
    ]

    const tableX = width - 120
    const tableY = padding + 20
    const rowHeight = 20
    const colWidth = 80

    metrics.forEach((metric, i) => {
      const y = tableY + i * rowHeight

      // Metric name
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(metric.name, tableX, y)

      // Metric value
      ctx.fillStyle = colors.teal
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(metric.value, tableX + 70, y)
    })

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[250px] rounded-lg" />
}
