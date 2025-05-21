"use client";
import React from "react";
import { useAppSelector } from "@/lib/store/hook";
import { Activity, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { motion } from "framer-motion";

export function ManualExport() {
  const { manualResult } = useAppSelector((state) => state.prediction);
  const riskScore = manualResult?.risk_assessment?.score ?? 0;
  const riskLevel =
    riskScore >= 0.75 ? "High" : riskScore >= 0.5 ? "Moderate" : "Low";
  const riskColor =
    riskScore >= 0.75
      ? "text-red-600"
      : riskScore >= 0.5
      ? "text-amber-600"
      : "text-green-600";
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/** PDF Header  */}
      <div className="bg-teal-600 dark:bg-teal-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <h2 className="text-xl font-bold">SepsisAI Report</h2>
          </div>
          <div className="text-sm text-teal-100">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Report ID: REP-{Math.floor(Math.random() * 10000)}</div>
          </div>
        </div>
      </div>
      {/** Patient Information */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3">Analysis Context</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          No personal identifiers provided. Data was entered manually or via
          CSV. Predictions are based purely on clinical features.
        </p>
      </div>
      {/** summary  */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Summary
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {manualResult?.risk_assessment?.interpretation && (
            <>
              <strong>{manualResult.risk_assessment.interpretation}.</strong>{" "}
            </>
          )}
          {manualResult?.risk_assessment?.detailed_analysis && (
            <>{manualResult.risk_assessment.detailed_analysis} </>
          )}
          {manualResult?.risk_assessment?.time_frame && (
            <>(Time frame: {manualResult.risk_assessment.time_frame})</>
          )}
        </p>
      </div>

      {/** Risk Assessment */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Risk Assessment
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                borderTopColor:
                  riskScore >= 0.75
                    ? "#ef4444"
                    : riskScore >= 0.5
                    ? "#f59e0b"
                    : "#10b981",
                transform: `rotate(${riskScore * 360}deg)`,
              }}
            ></div>
            <span className="text-lg font-bold">
              {Math.round(riskScore * 100)}%
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Risk Level
            </div>
            <div className={`text-xl font-bold ${riskColor}`}>{riskLevel}</div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h4 className="font-medium mb-2">Key Risk Indicators</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {manualResult?.key_risk_factors?.map((factor, index) => (
              <li key={index} className="text-xs">
                {factor.feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/** Model Explanation  */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3">Model Explanation</h3>
        <div className="space-y-3 mb-4">
          {[...(manualResult?.key_risk_factors || [])]
            .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) // Sort by importance
            .slice(0, 10) // Take top 10 features
            .map((riskFactor, index) => {
              const percentage = Math.abs(riskFactor.value) * 10;

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
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {manualResult?.risk_assessment?.detailed_analysis}
        </p>
      </div>
      {/** Recommendations */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Clinical Guidance</h3>
          <h3 className="text-md font-semibold mb-2">Monitoring</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
            {manualResult?.clinical_guidance?.monitoring?.map((item, i) => (
              <li key={i} className="text-xs">
                {item}
              </li>
            ))}
          </ul>
          <h3 className="text-md font-semibold mb-2">Diagnostic Tests</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
            {manualResult?.clinical_guidance?.diagnostic_tests?.map(
              (test, i) => (
                <li key={i} className="text-xs">
                  {test}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg  font-semibold mb-2 mt-5">
            Treatment Options
          </h3>
          <h3 className="text-sm font-semibold mb-2">Immediate Medications</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
            {manualResult?.clinical_guidance?.treatment_options?.immediate_medications?.map(
              (med, i) => (
                <li
                  key={i}
                  className={
                    med.startsWith("-") ? "ml-4 list-disc text-xs" : ""
                  }
                >
                  {med}
                </li>
              )
            )}
          </ul>

          <h3 className="text-md mt-4 font-semibold mb-2">
            Antibiotic Choices
          </h3>

          <h5 className="font-semibold text-sm mt-2">Community Acquired</h5>
          <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
            {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.community_acquired?.map(
              (abx, i) => (
                <li key={i}>{abx}</li>
              )
            )}
          </ul>

          <h5 className="font-semibold mt-2 text-sm">Hospital Acquired</h5>
          <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
            {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.hospital_acquired?.map(
              (abx, i) => (
                <li key={i}>{abx}</li>
              )
            )}
          </ul>

          <h4 className="font-semibold mt-2 text-sm">Penicillin Allergy</h4>
          <ul className="list-disc pl-10 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
            {manualResult?.clinical_guidance?.treatment_options?.antibiotic_choices?.penicillin_allergy?.map(
              (abx, i) => (
                <li key={i}>{abx}</li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-md font-semibold  mt-4">Required Actions</h3>
        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
          {manualResult?.clinical_guidance?.required_actions?.map(
            (action, i) => (
              <li key={i}>{action}</li>
            )
          )}
        </ul>
      </div>
      <div className="space-y-4">
        <h3 className="text-md font-semibold mb-2 mt-4">Safety Alerts</h3>
        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300 text-xs">
          {manualResult?.safety_alerts?.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
      </div>
      {/**  */}
      <div></div>
    </div>
  );
}
