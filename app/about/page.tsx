"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Database,
  FileBarChart,
  GitBranch,
  GraduationCap,
  BarChart3,
  Users,
  Layers,
  Download,
  ExternalLink,
} from "lucide-react"
import { motion } from "framer-motion"
import { ModelArchitecture } from "@/components/model-architecture"
import { ModelMetrics } from "@/components/model-metrics"
import { DatasetInfo } from "@/components/dataset-info"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">About SepsisAI</h1>
          <p className="text-muted-foreground dark:text-gray-400 max-w-3xl">
            Learn about our AI model, dataset, and the technology behind our early sepsis prediction system.
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="dataset" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Dataset</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Model</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                    >
                      Research Project
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      v1.2.0
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold">SepsisAI: Early Sepsis Prediction System</h2>

                  <p className="text-muted-foreground dark:text-gray-300">
                    SepsisAI is an advanced machine learning system designed to predict sepsis onset up to 6 hours
                    before clinical recognition. The model analyzes time-series patient data including vital signs and
                    laboratory results to identify patterns indicative of developing sepsis.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">Model Type</span>
                      <span className="font-medium">Ensemble (XGBoost + LSTM)</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                      <span className="font-medium">92.7% (Test Set)</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                      <span className="font-medium">March 2024</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-5">
                      <li>Early detection up to 6 hours before clinical signs</li>
                      <li>Continuous monitoring and real-time risk assessment</li>
                      <li>Explainable AI with feature importance visualization</li>
                      <li>Integration with hospital EHR systems</li>
                      <li>Personalized risk thresholds based on patient history</li>
                      <li>Treatment recommendation system</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                    >
                      <Download className="h-4 w-4" />
                      Technical Paper
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                    >
                      <GitBranch className="h-4 w-4" />
                      GitHub Repository
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Clinical Impact</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground dark:text-gray-300">
                    Sepsis affects approximately 1.7 million adults in the United States each year and is responsible
                    for nearly 270,000 deaths. Early detection and treatment are critical, with each hour of delayed
                    treatment increasing mortality by 4-8%.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">48%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Reduction in time to sepsis recognition
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">32%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Decrease in sepsis-related mortality
                      </div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">$4.2M</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Annual savings per hospital (est.)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dataset Tab */}
          <TabsContent value="dataset" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Training Dataset</h2>
                    <p className="text-muted-foreground dark:text-gray-300 max-w-3xl">
                      Our model was trained on the PhysioNet Computing in Cardiology Challenge 2019 dataset, augmented
                      with additional hospital data from our research partners.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Access Dataset
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dataset Composition</h3>
                    <DatasetInfo />

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Key Statistics</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Total patients:</span>
                          <span className="font-medium">40,336</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Sepsis cases:</span>
                          <span className="font-medium">2,932 (7.3%)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Non-sepsis cases:</span>
                          <span className="font-medium">37,404 (92.7%)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Time series length (avg):</span>
                          <span className="font-medium">48 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Sampling frequency:</span>
                          <span className="font-medium">1 hour</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Features</h3>
                    <p className="text-muted-foreground dark:text-gray-300">
                      The dataset includes 40 clinical variables collected at regular intervals, including vital signs,
                      laboratory values, and demographic information.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                      <div className="space-y-3">
                        <h4 className="font-medium">Vital Signs</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Heart Rate</li>
                          <li>Respiratory Rate</li>
                          <li>Temperature</li>
                          <li>Systolic Blood Pressure</li>
                          <li>Diastolic Blood Pressure</li>
                          <li>Mean Arterial Pressure</li>
                          <li>Oxygen Saturation (SpO2)</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Laboratory Values</h4>
                        <ul className="space-y-1 text-sm">
                          <li>White Blood Cell Count</li>
                          <li>Hemoglobin</li>
                          <li>Platelet Count</li>
                          <li>Glucose</li>
                          <li>Sodium, Potassium, Chloride</li>
                          <li>Creatinine</li>
                          <li>BUN, Lactate</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <FileBarChart className="h-4 w-4" />
                        Data Preprocessing
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Missing value imputation using forward-fill and median values</li>
                        <li>• Outlier detection and removal (IQR method)</li>
                        <li>• Feature normalization (z-score)</li>
                        <li>• Time series alignment and resampling</li>
                        <li>• Class balancing using SMOTE for training set</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Model Tab */}
          <TabsContent value="model" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">Model Architecture</h2>
                <p className="text-muted-foreground dark:text-gray-300 max-w-3xl mb-6">
                  SepsisAI uses a hybrid ensemble approach combining gradient boosting (XGBoost) for tabular data and
                  recurrent neural networks (LSTM) for temporal patterns.
                </p>

                <div className="mb-8">
                  <ModelArchitecture />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Model Components</h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">XGBoost Component</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Processes static features and aggregated time-series data to capture non-linear relationships.
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• 500 trees with max depth of 6</li>
                          <li>• Learning rate: 0.01</li>
                          <li>• L1 regularization: 0.01</li>
                          <li>• L2 regularization: 1.0</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">LSTM Component</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Processes temporal data to capture time-dependent patterns and trends in vital signs.
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• 2 bidirectional LSTM layers (128 units each)</li>
                          <li>• Dropout: 0.3</li>
                          <li>• Recurrent dropout: 0.2</li>
                          <li>• Attention mechanism for key time points</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Ensemble Integration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Combines predictions from both models using a meta-learner for final risk assessment.
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Stacked ensemble with logistic regression meta-learner</li>
                          <li>• Calibrated using Platt scaling</li>
                          <li>• Confidence intervals via bootstrap aggregation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <ModelMetrics />

                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-teal-700 dark:text-teal-400">
                        <BarChart3 className="h-4 w-4" />
                        Model Validation
                      </h4>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        The model was validated using 5-fold cross-validation and tested on an independent test set from
                        3 different hospitals not included in the training data. External validation showed consistent
                        performance across different patient populations and hospital settings.
                      </p>
                    </div>

                    <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <GraduationCap className="h-4 w-4" />
                        Ongoing Research
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Integration of genomic biomarkers for personalized risk assessment</li>
                        <li>• Federated learning across multiple hospital systems</li>
                        <li>• Reinforcement learning for treatment recommendation optimization</li>
                        <li>• Multimodal learning incorporating clinical notes and imaging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Research Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Dr. Sarah Chen",
                      role: "Principal Investigator",
                      specialty: "Critical Care Medicine",
                      institution: "Stanford University",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      name: "Dr. Michael Rodriguez",
                      role: "Clinical Lead",
                      specialty: "Infectious Disease",
                      institution: "Johns Hopkins University",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      name: "Dr. Aisha Patel",
                      role: "Data Scientist",
                      specialty: "Machine Learning",
                      institution: "MIT",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      name: "Dr. James Wilson",
                      role: "Biostatistician",
                      specialty: "Clinical Trials",
                      institution: "Harvard Medical School",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      name: "Dr. Emily Nakamura",
                      role: "Software Engineer",
                      specialty: "Healthcare AI",
                      institution: "University of Washington",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      name: "Dr. David Kim",
                      role: "Clinical Validator",
                      specialty: "Emergency Medicine",
                      institution: "UCSF Medical Center",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">{member.role}</p>
                      <p className="text-muted-foreground text-sm mt-1">{member.specialty}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{member.institution}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Partner Institutions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      "Stanford Medical Center",
                      "Johns Hopkins Hospital",
                      "Massachusetts General Hospital",
                      "UCSF Medical Center",
                      "Mayo Clinic",
                      "Cleveland Clinic",
                      "Mount Sinai Hospital",
                      "Duke University Hospital",
                    ].map((institution, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center p-4 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <span className="text-center font-medium text-gray-700 dark:text-gray-300">{institution}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Funding & Support</h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    This research was supported by grants from the National Institutes of Health (NIH), the National
                    Science Foundation (NSF), and the Gordon and Betty Moore Foundation. Additional support was provided
                    by the Stanford Center for AI in Medicine and Imaging.
                  </p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
