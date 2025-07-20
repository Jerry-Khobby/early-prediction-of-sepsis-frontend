"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, BarChart2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { User } from "lucide-react";
import { InlineAlert } from "./ui/inline-alert";
import { useAppSelector } from "@/lib/store/hook";

import { CsvPredictionResult } from "@/lib/store/prediction";


// The error I was facing here was ,  the data structure of displaying the results 

export function CsvResult() {
  const { csvResult, predictionType } = useAppSelector(
    (state) => state.prediction
  );
  const [selectedPatient, setSelectedPatient] =
    useState<CsvPredictionResult | null>(null);
  const router = useRouter();

  // Set first patient as selected when component mounts or csvResult changes
  useEffect(() => {
    if (
      csvResult?.reports &&
      csvResult.reports.length > 0 &&
      !selectedPatient
    ) {
      setSelectedPatient(csvResult.reports[0]);
    }
  }, [csvResult]);

  // Return early if no CSV results
  if (!csvResult || !csvResult.reports || csvResult.reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          No CSV prediction results available
        </p>
      </div>
    );
  }
  if (!selectedPatient || !selectedPatient.report?.patient_report) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading patient data...</p>
      </div>
    );
  }

  const getRiskLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return { level: "High", color: "text-red-600 dark:text-red-400" };
      case "moderate":
      case "medium":
        return {
          level: "Moderate",
          color: "text-amber-600 dark:text-amber-400",
        };
      default:
        return { level: "Low", color: "text-green-600 dark:text-green-400" };
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "destructive";
      case "moderate":
      case "medium":
        return "secondary";
      default:
        return "default";
    }
  };

  const riskInfo = getRiskLevel(selectedPatient?.risk_level || "Low");
  const riskScore = selectedPatient.probability;
  const patientReport = selectedPatient.report?.patient_report;

  if (!csvResult && predictionType !== "csv") {
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Patient List */}
      <div className="lg:col-span-1">
        <Card className="h-[600px] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Patients ({csvResult.reports.length})
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {csvResult.reports.map((patient) => (
                <Card
                  key={patient.patient_id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient.patient_id === patient.patient_id
                      ? "ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        P{patient.patient_id}
                      </span>
                    </div>
                    <Badge
                      variant={getRiskBadgeVariant(patient.risk_level)}
                      className="text-xs"
                    >
                      {getRiskLevel(patient.risk_level).level}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm truncate">
                      Patient {patient.patient_id}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Risk Score:
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          getRiskLevel(patient.risk_level).color
                        }`}
                      >
                        {Math.round(patient.probability * 100)}%
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
            key={selectedPatient.patient_id}
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
                    Patient {selectedPatient.patient_id}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {patientReport.report_type || "Risk Assessment"}
                  </p>
                  {patientReport.generated_at && (
                    <p className="text-xs text-muted-foreground">
                      Generated:{" "}
                      {new Date(patientReport.generated_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-6">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                      />
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
                      {patientReport.risk_assessment.time_frame ||
                        "Sepsis probability score"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`${selectedPatient.patient_id}-details`}
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
                        {selectedPatient.patient_id}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {patientReport.risk_assessment.interpretation}
                      </p>
                      {patientReport.risk_assessment.detailed_analysis && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {patientReport.risk_assessment.detailed_analysis}
                        </p>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Risk Factors */}
                      {patientReport.key_risk_factors &&
                        patientReport.key_risk_factors.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Key Risk Factors
                            </h3>
                            <div className="space-y-2">
                              {(patientReport?.key_risk_factors || []).map(
                                (factor, index) => (
                                  <div
                                    key={index}
                                    className="border rounded-lg p-3"
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium">
                                        {factor.marker}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        Importance:{" "}
                                        {Math.round(factor.importance * 100)}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {factor.note}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Clinical Guidance */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Recommended Actions
                        </h3>
                        {patientReport?.clinical_guidance?.required_actions
                          .length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                            {patientReport.clinical_guidance.required_actions.map(
                              (action, index) => (
                                <li key={index}>{action}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>

                      {/* Monitoring */}
                      {patientReport?.clinical_guidance?.monitoring.length >
                        0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Monitoring Requirements
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                            {patientReport?.clinical_guidance?.monitoring.map(
                              (item, index) => (
                                <li key={index}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Medications */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Treatment Options
                        </h3>
                        {patientReport?.clinical_guidance?.treatment_options
                          ?.immediate_medications.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">
                              Immediate Medications:
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                              {patientReport?.clinical_guidance?.treatment_options?.immediate_medications.map(
                                (med, index) => (
                                  <li key={index}>{med}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Antibiotic Choices */}
                        {patientReport?.clinical_guidance?.treatment_options
                          ?.antibiotic_choices && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Antibiotic Options:
                            </h4>
                            {Array.isArray(
                              patientReport.clinical_guidance.treatment_options
                                .antibiotic_choices
                            ) ? (
                              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                                {patientReport.clinical_guidance.treatment_options.antibiotic_choices.map(
                                  (antibiotic, index) => (
                                    <li key={index}>{antibiotic}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <div className="space-y-2">
                                {patientReport.clinical_guidance
                                  .treatment_options.antibiotic_choices
                                  .community_acquired && (
                                  <div>
                                    <span className="font-medium">
                                      Community Acquired:
                                    </span>
                                    <ul className="list-disc pl-5 mt-1">
                                      {patientReport.clinical_guidance.treatment_options.antibiotic_choices.community_acquired.map(
                                        (antibiotic, index) => (
                                          <li key={index}>{antibiotic}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {patientReport.clinical_guidance
                                  .treatment_options.antibiotic_choices
                                  .hospital_acquired && (
                                  <div>
                                    <span className="font-medium">
                                      Hospital Acquired:
                                    </span>
                                    <ul className="list-disc pl-5 mt-1">
                                      {patientReport.clinical_guidance.treatment_options.antibiotic_choices.hospital_acquired.map(
                                        (antibiotic, index) => (
                                          <li key={index}>{antibiotic}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {patientReport.clinical_guidance
                                  .treatment_options.antibiotic_choices
                                  .penicillin_allergy && (
                                  <div>
                                    <span className="font-medium">
                                      Penicillin Allergy:
                                    </span>
                                    <ul className="list-disc pl-5 mt-1">
                                      {patientReport.clinical_guidance.treatment_options.antibiotic_choices.penicillin_allergy.map(
                                        (antibiotic, index) => (
                                          <li key={index}>{antibiotic}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Safety Alerts */}
                      {patientReport.safety_alerts?.precautions?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Safety Precautions
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                            {patientReport.safety_alerts.precautions.map(
                              (precaution, index) => (
                                <li key={index}>{precaution}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
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
                      {patientReport.key_risk_factors.map((factor, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{factor.marker}</span>
                            <span className="font-medium">
                              {Math.round(factor.importance * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <motion.div
                              className={`h-2.5 rounded-full ${
                                factor.importance >= 0.75
                                  ? "bg-red-500 dark:bg-red-600"
                                  : factor.importance >= 0.5
                                  ? "bg-amber-500 dark:bg-amber-600"
                                  : "bg-green-500 dark:bg-green-600"
                              }`}
                              style={{ width: `${factor.importance * 100}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.importance * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {factor.note}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-2">
                        Interpretation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {patientReport.risk_assessment.detailed_analysis ||
                          patientReport.risk_assessment.interpretation}
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
