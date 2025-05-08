"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900/80",
        "before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-br before:from-teal-50 before:to-amber-50 before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
        "dark:before:from-teal-900/20 dark:before:to-amber-900/20",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground dark:text-gray-400">{description}</p>
    </motion.div>
  )
}
