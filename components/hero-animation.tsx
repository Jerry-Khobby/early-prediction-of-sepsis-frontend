"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function HeroAnimation() {
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

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.clientWidth
        this.y = Math.random() * canvas.clientHeight
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(21, 94, 99, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.clientWidth) this.x = 0
        else if (this.x < 0) this.x = canvas.clientWidth

        if (this.y > canvas.clientHeight) this.y = 0
        else if (this.y < 0) this.y = canvas.clientHeight
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Connect particles with lines
    function connectParticles() {
      const maxDistance = 100
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(21, 94, 99, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Draw medical chart background
      drawMedicalChart()

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      connectParticles()
      requestAnimationFrame(animate)
    }

    // Draw a stylized medical chart
    function drawMedicalChart() {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      // Draw grid
      ctx.strokeStyle = "rgba(21, 94, 99, 0.1)"
      ctx.lineWidth = 1

      // Vertical grid lines
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw heartbeat line
      const now = Date.now() / 1000
      ctx.strokeStyle = "rgba(21, 94, 99, 0.6)"
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x < width; x += 1) {
        // Create a heartbeat-like pattern
        const y =
          height / 2 +
          Math.sin(x / 20 + now) * 20 +
          Math.sin(x / 10 + now * 2) * 10 +
          (x % 100 < 10 ? Math.sin(((x % 100) / 10) * Math.PI) * 40 : 0)

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[400px] rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 to-amber-50/80 dark:from-teal-900/30 dark:to-amber-900/30 backdrop-blur-[2px] rounded-xl"></div>
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-teal-100 dark:border-teal-900/50 max-w-[80%]">
          <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-2">AI-Powered Sepsis Detection</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Our model analyzes patient data to predict sepsis up to 6 hours before clinical recognition
          </p>
        </div>
      </div>
    </motion.div>
  )
}
