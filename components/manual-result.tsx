"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, BarChart2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PredictionLoading } from "./predictionLoading";
import { useAppSelector } from "@/lib/store/hook";
import { InlineAlert } from "@/components/ui/inline-alert";

export function ManualResult() {
  const { manualResult, predictionType } = useAppSelector(
    (state) => state.prediction
  );
  const router = useRouter();

  if (!manualResult && predictionType !== "manual") {
    return (
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        <InlineAlert
          title="No Results Found"
          description="It looks like you haven't uploaded any data or run a prediction yet."
        />
        <p className="mt-4 text-muted-foreground dark:text-gray-400 max-w-md">
          Please upload a file or enter patient details manually to get a
          prediction.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="mt-6 text-[#44bfb2] text-sm font-medium hover:underline transition"
        >
          Go to Upload Page
        </button>
      </main>
    );
  }
  const riskScore = manualResult?.risk_assessment?.score ?? 0;
  const getRiskLevel = (score: number) => {
    if (score >= 0.75)
      return { level: "High", color: "text-red-600 dark:text-red-400" };
    if (score >= 0.5)
      return {
        level: "Moderate",
        color: "text-amber-600 dark:text-amber-400",
      };
    return { level: "Low", color: "text-green-600 dark:text-green-400" };
  };
  const riskInfo = getRiskLevel(riskScore);

  return (
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
                  {manualResult?.risk_assessment?.level} Risk
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
                <TabsTrigger value="report" className="flex items-center gap-2">
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
                    {manualResult?.risk_assessment?.interpretation && (
                      <>
                        <strong>
                          {manualResult.risk_assessment.interpretation}.
                        </strong>{" "}
                      </>
                    )}
                    {manualResult?.risk_assessment?.detailed_analysis && (
                      <>{manualResult.risk_assessment.detailed_analysis} </>
                    )}
                    {manualResult?.risk_assessment?.time_frame && (
                      <>
                        (Time frame: {manualResult.risk_assessment.time_frame})
                      </>
                    )}
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Clinical Guidance
                    </h3>
                    <h3 className="text-lg font-semibold mb-2">Monitoring</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.monitoring?.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        )
                      )}
                    </ul>
                    <h3 className="text-lg font-semibold mb-2">
                      Diagnostic Tests
                    </h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.diagnostic_tests?.map(
                        (test, i) => (
                          <li key={i}>{test}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Treatment Options
                    </h3>
                    <h3 className="text-lg font-semibold mb-2">
                      Immediate Medications
                    </h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.treatment_options?.immediate_medications?.map(
                        (med, i) => (
                          <li
                            key={i}
                            className={
                              med.startsWith("-") ? "ml-4 list-disc" : ""
                            }
                          >
                            {med}
                          </li>
                        )
                      )}
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">
                      Antibiotic Choices
                    </h3>

                    <h4 className="font-semibold mt-2">Community Acquired</h4>
                    <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.community_acquired?.map(
                        (abx, i) => (
                          <li key={i}>{abx}</li>
                        )
                      )}
                    </ul>

                    <h4 className="font-semibold mt-2">Hospital Acquired</h4>
                    <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.hospital_acquired?.map(
                        (abx, i) => (
                          <li key={i}>{abx}</li>
                        )
                      )}
                    </ul>

                    <h4 className="font-semibold mt-2">Penicillin Allergy</h4>
                    <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300">
                      {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.penicillin_allergy?.map(
                        (abx, i) => (
                          <li key={i}>{abx}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Required Actions
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    {manualResult?.clinical_guidance?.required_actions?.map(
                      (action, i) => (
                        <li key={i}>{action}</li>
                      )
                    )}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-2">Safety Alerts</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    {manualResult?.safety_alerts?.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    {manualResult?.disclaimers?.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
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
                  {manualResult?.key_risk_factors
                    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) // Sort by importance
                    .slice(0, 10) // Take top 10 features
                    .map((riskFactor, index) => {
                      const percentage = Math.abs(riskFactor.value) * 100;

                      // Assign 10 distinct colors based on sorted index
                      const colorClasses = [
                        "bg-red-700 dark:bg-red-800", // 1st - Most important
                        "bg-orange-600 dark:bg-orange-700", // 2nd
                        "bg-amber-500 dark:bg-amber-600", // 3rd
                        "bg-yellow-500 dark:bg-yellow-600", // 4th
                        "bg-lime-500 dark:bg-lime-600", // 5th
                        "bg-emerald-500 dark:bg-emerald-600", // 6th
                        "bg-teal-500 dark:bg-teal-600", // 7th
                        "bg-cyan-500 dark:bg-cyan-600", // 8th
                        "bg-blue-500 dark:bg-blue-600", // 9th
                        "bg-indigo-400 dark:bg-indigo-500", // 10th
                      ];
                      const colorClass = colorClasses[index] || "bg-gray-400"; // Fallback

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{riskFactor.feature}</span>
                            <span className="font-medium">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <motion.div
                              className={`h-2.5 rounded-full ${colorClass}`}
                              style={{ width: `${percentage}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {manualResult?.risk_assessment.detailed_analysis}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
