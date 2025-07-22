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
import { RootState } from "@/lib/store/store";
import { useAppSelector } from "@/lib/store/hook";
import { CsvPredictionResult } from "@/lib/store/prediction";

export function CsvResult() {
  const router = useRouter();
  const { csvResult, loading, error, predictionType } = useAppSelector(
    (state: RootState) => state.prediction
  );
  const [selectedPatient, setSelectedPatient] =
    useState<CsvPredictionResult | null>(null);

  useEffect(() => {
    if (
      csvResult?.reports &&
      csvResult.reports.length > 0 &&
      !selectedPatient
    ) {
      setSelectedPatient(csvResult.reports[0]);
    }
  }, [csvResult, selectedPatient]);

  if (loading) return <PredictionLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!csvResult) return <div>No results available</div>;

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

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 0.75) return "destructive";
    if (score >= 0.5) return "secondary";
    return "default";
  };

  if (!selectedPatient) return <div>No patient selected</div>;

  const riskScore = selectedPatient?.probability || 0;
  const riskInfo = getRiskLevel(riskScore);
  const report = selectedPatient?.report;

  console.log("Selected Patient Report:", report);
  console.log("Key risk factor", report?.key_risk_factors);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Patient List */}
      <div className="lg:col-span-1">
        <Card className="h-[600px] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Patients ({csvResult?.reports?.length || 0})
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {csvResult?.reports?.map((patient) => (
                <Card
                  key={patient?.patient_id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient?.patient_id === patient?.patient_id
                      ? "ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {patient?.patient_id}
                      </span>
                    </div>
                    <Badge
                      variant={getRiskBadgeVariant(patient?.probability || 0)}
                      className="text-xs"
                    >
                      {getRiskLevel(patient?.probability || 0).level}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm truncate">
                      Patient {patient?.patient_id}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Risk Score:
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          getRiskLevel(patient?.probability || 0).color
                        }`}
                      >
                        {Math.round((patient?.probability || 0) * 100)}%
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
            key={`risk-assessment-${selectedPatient?.patient_id}`}
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
                    Patient {selectedPatient?.patient_id}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {report?.risk_assessment?.time_frame}
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
                      {report?.risk_assessment?.level}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400">
                      {report?.risk_assessment?.time_frame}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`${selectedPatient?.patient_id}-details`}
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
                        Clinical Assessment for Patient{" "}
                        {selectedPatient?.patient_id}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {report?.risk_assessment?.interpretation}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Clinical Guidance
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">Monitoring</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {report?.clinical_guidance?.monitoring?.map(
                                (item, i) => <li key={i}>{item}</li>
                              ) || []}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">
                              Diagnostic Tests
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {report?.clinical_guidance?.diagnostic_tests?.map(
                                (item, i) => <li key={i}>{item}</li>
                              ) || []}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">
                              Treatment Options
                            </h4>
                            <div className="pl-5 space-y-2">
                              <div>
                                <p className="font-medium text-sm">
                                  Immediate Medications:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                  {report?.clinical_guidance?.treatment_options?.immediate_medications?.map(
                                    (item, i) => <li key={i}>{item}</li>
                                  ) || []}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  Antibiotic Choices:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                  {Array.isArray(
                                    report?.clinical_guidance?.treatment_options
                                      ?.antibiotic_choices
                                  ) ? (
                                    report?.clinical_guidance?.treatment_options?.antibiotic_choices?.map(
                                      (item, i) => <li key={i}>{item}</li>
                                    )
                                  ) : (
                                    <>
                                      {report?.clinical_guidance
                                        ?.treatment_options?.antibiotic_choices
                                        ?.community_acquired && (
                                        <>
                                          <li className="font-medium">
                                            Community Acquired:
                                          </li>
                                          {report?.clinical_guidance?.treatment_options?.antibiotic_choices?.community_acquired?.map(
                                            (item, i) => (
                                              <li key={i} className="pl-5">
                                                {item}
                                              </li>
                                            )
                                          ) || []}
                                        </>
                                      )}
                                      {report?.clinical_guidance
                                        ?.treatment_options?.antibiotic_choices
                                        ?.hospital_acquired && (
                                        <>
                                          <li className="font-medium">
                                            Hospital Acquired:
                                          </li>
                                          {report?.clinical_guidance?.treatment_options?.antibiotic_choices?.hospital_acquired?.map(
                                            (item, i) => (
                                              <li key={i} className="pl-5">
                                                {item}
                                              </li>
                                            )
                                          ) || []}
                                        </>
                                      )}
                                      {report?.clinical_guidance
                                        ?.treatment_options?.antibiotic_choices
                                        ?.penicillin_allergy && (
                                        <>
                                          <li className="font-medium">
                                            Penicillin Allergy:
                                          </li>
                                          {report?.clinical_guidance?.treatment_options?.antibiotic_choices?.penicillin_allergy?.map(
                                            (item, i) => (
                                              <li key={i} className="pl-5">
                                                {item}
                                              </li>
                                            )
                                          ) || []}
                                        </>
                                      )}
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">
                              Required Actions
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {report?.clinical_guidance?.required_actions?.map(
                                (item, i) => <li key={i}>{item}</li>
                              ) || []}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Safety Alerts
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {report?.safety_alerts?.precautions?.map(
                            (item, i) => <li key={i}>{item}</li>
                          ) || []}
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
                      {report?.key_risk_factors?.map((factor, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{factor?.marker}</span>
                            <span className="font-medium">
                              {Math.round((factor?.importance || 0) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <motion.div
                              className={`h-2.5 rounded-full ${
                                (factor?.importance || 0) >= 0.15
                                  ? "bg-red-500 dark:bg-red-600"
                                  : (factor?.importance || 0) >= 0.1
                                  ? "bg-orange-500 dark:bg-orange-600"
                                  : "bg-amber-500 dark:bg-amber-600"
                              }`}
                              style={{
                                width: `${(factor?.importance || 0) * 100}%`,
                              }}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(factor?.importance || 0) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      )) || []}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-2">
                        Detailed Analysis
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {report?.risk_assessment?.detailed_analysis}
                      </p>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Disclaimers
                      </h3>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <p>{report?.disclaimers?.model_use}</p>
                        <p>{report?.disclaimers?.physician_oversight}</p>
                        <p>{report?.disclaimers?.limitations}</p>
                      </div>
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
