"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, BarChart2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PredictionLoading } from "./predictionLoading";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { User } from "lucide-react";

const patientsData = [
  { id: "P001", riskScore: 0.85 },
  { id: "P002", riskScore: 0.23 },
  { id: "P003", riskScore: 0.67 },
  { id: "P004", riskScore: 0.91 },
  { id: "P005", riskScore: 0.15 },
  { id: "P006", riskScore: 0.78 },
  { id: "P007", riskScore: 0.34 },
  { id: "P008", riskScore: 0.82 },
  { id: "P009", riskScore: 0.56 },
  { id: "P010", riskScore: 0.41 },
  { id: "P011", riskScore: 0.73 },
  { id: "P012", riskScore: 0.19 },
  { id: "P013", riskScore: 0.88 },
  { id: "P014", riskScore: 0.62 },
  { id: "P015", riskScore: 0.27 },
  { id: "P016", riskScore: 0.79 },
  { id: "P017", riskScore: 0.45 },
  { id: "P018", riskScore: 0.84 },
  { id: "P019", riskScore: 0.38 },
  { id: "P020", riskScore: 0.71 },
];

export function CsvResult() {
  const [selectedPatient, setSelectedPatient] = useState(patientsData[0]);
  const riskScore = selectedPatient.riskScore;
  const router = useRouter();
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

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 0.75) return "destructive";
    if (score >= 0.5) return "secondary";
    return "default";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Patient List */}
      <div className="lg:col-span-1">
        <Card className="h-[600px] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Patients (20)</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {patientsData.map((patient) => (
                <Card
                  key={patient.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient.id === patient.id
                      ? "ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{patient.id}</span>
                    </div>
                    <Badge
                      variant={getRiskBadgeVariant(patient.riskScore)}
                      className="text-xs"
                    >
                      {getRiskLevel(patient.riskScore).level}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm truncate">{patient.id}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Risk Score:
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          getRiskLevel(patient.riskScore).color
                        }`}
                      >
                        {Math.round(patient.riskScore * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Patient Details */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            key={selectedPatient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden h-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Risk Assessment
                </h2>
                <div className="mb-4">
                  <h3 className="font-bold text-md">
                    Patient {selectedPatient.id}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Risk Assessment
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-6">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
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
                        fontSize="16"
                        fontWeight="bold"
                        fill="currentColor"
                      >
                        {Math.round(riskScore * 100)}%
                      </text>
                    </svg>
                  </div>

                  <div className="text-center">
                    <h3 className={`text-xl font-bold mb-1 ${riskInfo.color}`}>
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
            key={`${selectedPatient.id}-details`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
                    <div
                      className={`p-4 rounded-lg mb-6 ${
                        riskScore >= 0.75
                          ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
                          : riskScore >= 0.5
                          ? "bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30"
                          : "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
                      }`}
                    >
                      <h3 className={`font-semibold mb-1 ${riskInfo.color}`}>
                        Clinical Assessment for Patient {selectedPatient.id}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {riskScore >= 0.75
                          ? "The patient shows signs of early-stage sepsis, with elevated respiratory rate and low MAP over 4 hours. Immediate intervention is recommended."
                          : riskScore >= 0.5
                          ? "The patient shows moderate risk indicators. Continue monitoring and consider preventive measures."
                          : "The patient shows low risk for sepsis. Continue routine monitoring and maintain current care plan."}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Suggested Actions
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          {riskScore >= 0.75 ? (
                            <>
                              <li>Immediate fluid resuscitation</li>
                              <li>Blood cultures and lactate measurement</li>
                              <li>Broad-spectrum antibiotics within 1 hour</li>
                              <li>Continuous vital sign monitoring</li>
                            </>
                          ) : riskScore >= 0.5 ? (
                            <>
                              <li>Increase monitoring frequency</li>
                              <li>Monitor WBC trend</li>
                              <li>
                                Consider blood cultures if symptoms worsen
                              </li>
                              <li>Review infection control measures</li>
                            </>
                          ) : (
                            <>
                              <li>Continue routine monitoring</li>
                              <li>Maintain current care plan</li>
                              <li>Monitor for any changes in condition</li>
                              <li>Ensure proper hygiene protocols</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Possible Medications
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          {riskScore >= 0.75 ? (
                            <>
                              <li>Piperacillin-tazobactam</li>
                              <li>Vancomycin (if MRSA risk)</li>
                              <li>
                                Consider vasopressors if MAP remains low after
                                fluid resuscitation
                              </li>
                            </>
                          ) : riskScore >= 0.5 ? (
                            <>
                              <li>Consider prophylactic antibiotics</li>
                              <li>Monitor for need of intervention</li>
                              <li>Maintain current medications</li>
                            </>
                          ) : (
                            <>
                              <li>Continue current medication regimen</li>
                              <li>No additional antibiotics needed</li>
                              <li>Monitor for any changes</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t flex justify-end gap-4 mt-auto">
                    <Link href="/upload">
                      <Button variant="outline">Regenerate Report</Button>
                    </Link>

                    <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
                      <Link className="flex items-center gap-2" href="/export">
                        <Download className="h-4 w-4" /> Export Report
                      </Link>
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
                          value: riskScore * 0.9,
                          color: "bg-red-500 dark:bg-red-600",
                        },
                        {
                          name: "Mean Arterial Pressure",
                          value: riskScore * 0.8,
                          color: "bg-orange-500 dark:bg-orange-600",
                        },
                        {
                          name: "Heart Rate",
                          value: riskScore * 0.7,
                          color: "bg-amber-500 dark:bg-amber-600",
                        },
                        {
                          name: "Temperature",
                          value: riskScore * 0.6,
                          color: "bg-yellow-500 dark:bg-yellow-600",
                        },
                        {
                          name: "O2 Saturation",
                          value: riskScore * 0.5,
                          color: "bg-teal-500 dark:bg-teal-600",
                        },
                        {
                          name: "WBC Count",
                          value: riskScore * 0.4,
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
                        For Patient {selectedPatient.id}, the model identified{" "}
                        {riskScore >= 0.75
                          ? "elevated respiratory rate and decreased mean arterial pressure as the strongest indicators of sepsis risk."
                          : riskScore >= 0.5
                          ? "moderate deviations in vital signs that warrant continued monitoring."
                          : "stable vital signs with minimal risk indicators for sepsis development."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
