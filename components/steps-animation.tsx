"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, BarChart2, FileText } from "lucide-react"

const steps = [
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Upload Data",
    description: "Upload patient time-series data or enter vitals manually",
    color: "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-400",
  },
  {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Get Predictions",
    description: "Our AI model analyzes the data and provides risk assessment",
    color: "from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-400",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "View Report",
    description: "Receive detailed analysis and treatment recommendations",
    color: "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-400",
  },
]

export function StepsAnimation() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.7, y: 10 }}
          animate={{
            opacity: activeStep === index ? 1 : 0.7,
            y: activeStep === index ? 0 : 10,
            scale: activeStep === index ? 1.05 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="relative rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-900/80 dark:to-slate-900/50 backdrop-blur-sm z-10"></div>
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-20 dark:opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${step.color.split(" ")[1]}, transparent 70%)`,
            }}
          ></div>

          <div className="relative z-20 p-6 flex flex-col items-center text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white mb-4`}
            >
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground dark:text-gray-400">{step.description}</p>

            {activeStep === index && (
              <motion.div
                layoutId="step-indicator"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 dark:from-teal-400 dark:to-amber-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
