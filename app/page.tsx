import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, FileText, PieChart } from "lucide-react"
import { HeroAnimation } from "@/components/hero-animation"
import { FeatureCard } from "@/components/feature-card"
import { StepsAnimation } from "@/components/steps-animation"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80 py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">
                    Early Sepsis Prediction System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl dark:text-gray-300">
                    Advanced AI-powered system for early detection of sepsis using patient vital signs and lab results.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white">
                    <Link href="/upload" className="flex items-center gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                  >
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 dark:bg-teal-900/30 px-3 py-1 text-sm text-teal-700 dark:text-teal-300">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Model Capabilities</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our AI model provides comprehensive analysis and prediction for early sepsis detection
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <FeatureCard
                icon={<Activity className="h-10 w-10 text-teal-600 dark:text-teal-400" />}
                title="Real-Time Prediction"
                description="Instant risk assessment based on patient vitals and lab results"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-amber-600 dark:text-amber-400" />}
                title="Doctor-Style Report"
                description="AI-generated clinical notes and recommendations"
              />
              <FeatureCard
                icon={<PieChart className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />}
                title="Risk-Based Suggestions"
                description="Personalized treatment and medication recommendations"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm text-amber-700 dark:text-amber-300">
                  Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Simple 3-step process to get accurate sepsis predictions
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <StepsAnimation />
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-10">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Medical Disclaimer</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This tool is not a substitute for professional medical diagnosis. For academic/demonstration use only.
                Always consult with qualified healthcare providers for medical advice and treatment.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
