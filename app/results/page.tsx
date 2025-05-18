"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Download, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hook";
import { useRouter } from "next/navigation";
import { PredictionLoading } from "@/components/predictionLoading";

export default function ResultsPage() {
  const [riskScore] = useState(0.78);
  const router = useRouter();
  const result = useAppSelector((state) => state.prediction.result);
  // Risk level based on score
  const getRiskLevel = (score: number) => {
    if (score >= 0.75)
      return { level: "High", color: "text-red-600 dark:text-red-400" };
    if (score >= 0.5)
      return { level: "Moderate", color: "text-amber-600 dark:text-amber-400" };
    return { level: "Low", color: "text-green-600 dark:text-green-400" };
  };

  const riskInfo = getRiskLevel(riskScore);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Prediction Results</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            AI-powered sepsis risk assessment and recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Risk Assessment
                </h2>

                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-6">
                    <svg className="w-40 h-40" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                      />

                      {/* Progress circle */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          riskScore >= 0.75
                            ? "#ef4444"
                            : riskScore >= 0.5
                            ? "#f59e0b"
                            : "#10b981"
                        }
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        className="dark:stroke-opacity-90"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - 283 * riskScore,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />

                      {/* Percentage text */}
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="currentColor"
                      >
                        {Math.round(riskScore * 100)}%
                      </text>
                    </svg>
                  </div>

                  <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-1 ${riskInfo.color}`}>
                      {riskInfo.level} Risk
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400">
                      Sepsis probability score
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <Tabs defaultValue="report" className="h-full flex flex-col">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="report"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      AI Report
                    </TabsTrigger>
                    <TabsTrigger
                      value="explanation"
                      className="flex items-center gap-2"
                    >
                      <BarChart2 className="h-4 w-4" />
                      Model Explanation
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="report" className="flex-1 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6 dark:bg-red-900/20 dark:border-red-900/30">
                      <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">
                        Clinical Assessment
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        The patient shows signs of early-stage sepsis, with
                        elevated respiratory rate and low MAP over 4 hours.
                        Immediate intervention is recommended.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Suggested Actions
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          <li>Fluid resuscitation</li>
                          <li>Monitor WBC trend</li>
                          <li>Blood cultures</li>
                          <li>Hourly vital sign monitoring</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Possible Medications
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          <li>Piperacillin-tazobactam</li>
                          <li>Vancomycin (if MRSA risk)</li>
                          <li>
                            Consider vasopressors if MAP remains low after fluid
                            resuscitation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t flex justify-end gap-4 mt-auto">
                    <Button variant="outline">Regenerate Report</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Export Report
                      </span>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="explanation" className="flex-1">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Feature Importance
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          name: "Respiratory Rate",
                          value: 0.85,
                          color: "bg-red-500 dark:bg-red-600",
                        },
                        {
                          name: "Mean Arterial Pressure",
                          value: 0.72,
                          color: "bg-orange-500 dark:bg-orange-600",
                        },
                        {
                          name: "Heart Rate",
                          value: 0.65,
                          color: "bg-amber-500 dark:bg-amber-600",
                        },
                        {
                          name: "Temperature",
                          value: 0.58,
                          color: "bg-yellow-500 dark:bg-yellow-600",
                        },
                        {
                          name: "O2 Saturation",
                          value: 0.45,
                          color: "bg-teal-500 dark:bg-teal-600",
                        },
                        {
                          name: "WBC Count",
                          value: 0.38,
                          color: "bg-green-500 dark:bg-green-600",
                        },
                      ].map((feature, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{feature.name}</span>
                            <span className="font-medium">
                              {Math.round(feature.value * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <motion.div
                              className={`h-2.5 rounded-full ${feature.color}`}
                              style={{ width: `${feature.value * 100}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${feature.value * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-2">
                        Interpretation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        The model identified elevated respiratory rate and
                        decreased mean arterial pressure as the strongest
                        indicators of sepsis risk. These vital signs showed
                        significant deviation from normal ranges over the past 4
                        hours.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
