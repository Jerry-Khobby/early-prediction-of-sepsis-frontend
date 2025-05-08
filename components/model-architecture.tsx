"use client"

import { useEffect, useRef } from "react"

export function ModelArchitecture() {
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

    // Colors
    const colors = {
      background: getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff",
      foreground: getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#000000",
      teal: "#14b8a6",
      amber: "#f59e0b",
      indigo: "#6366f1",
      gray: "#94a3b8",
    }

    // Check if dark mode
    const isDarkMode = document.documentElement.classList.contains("dark")
    const bgColor = isDarkMode ? "#1e293b" : "#f8fafc"
    const textColor = isDarkMode ? "#e2e8f0" : "#334155"
    const lineColor = isDarkMode ? "#475569" : "#cbd5e1"

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Draw model architecture
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const padding = 20
    const boxHeight = 40
    const boxWidth = 120
    const arrowLength = 40

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Hybrid Ensemble Architecture", width / 2, padding)

    // Input layer
    const inputY = padding + 50
    drawBox(ctx, width / 2 - boxWidth / 2, inputY, boxWidth, boxHeight, "Input Data", colors.gray)

    // Draw arrows to feature extraction
    const featureY = inputY + boxHeight + arrowLength
    drawArrow(ctx, width / 2, inputY + boxHeight, width / 2, featureY, lineColor)
    drawBox(ctx, width / 2 - boxWidth / 2, featureY, boxWidth, boxHeight, "Feature Extraction", colors.gray)

    // Draw arrows to model components
    const modelY = featureY + boxHeight + arrowLength
    const xgbX = width / 3 - boxWidth / 2
    const lstmX = (2 * width) / 3 - boxWidth / 2

    // Arrow to XGBoost
    drawArrow(ctx, width / 2, featureY + boxHeight, xgbX + boxWidth / 2, modelY, lineColor)
    drawBox(ctx, xgbX, modelY, boxWidth, boxHeight, "XGBoost", colors.teal)

    // Arrow to LSTM
    drawArrow(ctx, width / 2, featureY + boxHeight, lstmX + boxWidth / 2, modelY, lineColor)
    drawBox(ctx, lstmX, modelY, boxWidth, boxHeight, "LSTM", colors.amber)

    // Draw arrows to ensemble
    const ensembleY = modelY + boxHeight + arrowLength
    drawArrow(ctx, xgbX + boxWidth / 2, modelY + boxHeight, width / 2, ensembleY, lineColor)
    drawArrow(ctx, lstmX + boxWidth / 2, modelY + boxHeight, width / 2, ensembleY, lineColor)
    drawBox(ctx, width / 2 - boxWidth / 2, ensembleY, boxWidth, boxHeight, "Ensemble", colors.indigo)

    // Draw arrow to output
    const outputY = ensembleY + boxHeight + arrowLength
    drawArrow(ctx, width / 2, ensembleY + boxHeight, width / 2, outputY, lineColor)
    drawBox(ctx, width / 2 - boxWidth / 2, outputY, boxWidth, boxHeight, "Risk Prediction", colors.gray)

    // Helper function to draw a box
    function drawBox(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      text: string,
      color: string,
    ) {
      // Draw box
      ctx.fillStyle = color
      ctx.globalAlpha = 0.2
      ctx.fillRect(x, y, width, height)
      ctx.globalAlpha = 1.0

      // Draw border
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Draw text
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, x + width / 2, y + height / 2)
    }

    // Helper function to draw an arrow
    function drawArrow(
      ctx: CanvasRenderingContext2D,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      color: string,
    ) {
      const headLength = 10
      const angle = Math.atan2(toY - fromY, toX - fromX)

      // Draw line
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw arrowhead
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[300px] rounded-lg" />
}
