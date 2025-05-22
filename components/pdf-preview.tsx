"use client"

import { Activity, AlertCircle, CheckCircle2, FileText } from "lucide-react"

interface PDFPreviewProps {
  includeOptions: {
    summary: boolean
    riskAssessment: boolean
    modelExplanation: boolean
    recommendations: boolean
    patientData: boolean
  }
}

export function PDFPreview({ includeOptions }: PDFPreviewProps) {
  // Mock data for the PDF preview
  const patientData = {
    id: "P12345",
    name: "John Doe",
    age: 65,
    gender: "Male",
    admissionDate: "2024-05-08",
    department: "Emergency Medicine",
  }

  const riskScore = 0.78
  const riskLevel = riskScore >= 0.75 ? "High" : riskScore >= 0.5 ? "Moderate" : "Low"
  const riskColor = riskScore >= 0.75 ? "text-red-600" : riskScore >= 0.5 ? "text-amber-600" : "text-green-600"

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* PDF Header */}
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

      {/* Patient Information */}
      {includeOptions.patientData && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Patient ID</div>
              <div>{patientData.id}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Name</div>
              <div>{patientData.name}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Age</div>
              <div>{patientData.age}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Gender</div>
              <div>{patientData.gender}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Admission Date</div>
              <div>{patientData.admissionDate}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Department</div>
              <div>{patientData.department}</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {includeOptions.summary && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            The patient shows signs of early-stage sepsis, with elevated respiratory rate and low MAP over 4 hours.
            Based on the analysis of vital signs and laboratory results, the AI model predicts a high risk of sepsis
            development within the next 6 hours. Immediate intervention is recommended to prevent progression to septic
            shock.
          </p>
        </div>
      )}

      {/* Risk Assessment */}
      {includeOptions.riskAssessment && (
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
                  borderTopColor: riskScore >= 0.75 ? "#ef4444" : riskScore >= 0.5 ? "#f59e0b" : "#10b981",
                  transform: `rotate(${riskScore * 360}deg)`,
                }}
              ></div>
              <span className="text-lg font-bold">{Math.round(riskScore * 100)}%</span>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Risk Level</div>
              <div className={`text-xl font-bold ${riskColor}`}>{riskLevel}</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium mb-2">Key Risk Indicators</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Elevated respiratory rate (24 breaths/min)</li>
              <li>Low mean arterial pressure (65 mmHg)</li>
              <li>Elevated heart rate (110 bpm)</li>
              <li>Elevated temperature (38.5°C)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Model Explanation */}
      {includeOptions.modelExplanation && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Model Explanation</h3>

          <div className="space-y-3 mb-4">
            {[
              { name: "Respiratory Rate", value: 0.85 },
              { name: "Mean Arterial Pressure", value: 0.72 },
              { name: "Heart Rate", value: 0.65 },
              { name: "Temperature", value: 0.58 },
              { name: "O2 Saturation", value: 0.45 },
            ].map((feature, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{feature.name}</span>
                  <span className="font-medium">{Math.round(feature.value * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-teal-600 dark:bg-teal-500"
                    style={{ width: `${feature.value * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            The model identified elevated respiratory rate and decreased mean arterial pressure as the strongest
            indicators of sepsis risk. These vital signs showed significant deviation from normal ranges over the past 4
            hours.
          </p>
        </div>
      )}

      {/* Recommendations */}
      {includeOptions.recommendations && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Recommendations
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Suggested Actions</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Fluid resuscitation</li>
                <li>Monitor WBC trend</li>
                <li>Blood cultures</li>
                <li>Hourly vital sign monitoring</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Possible Medications</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Piperacillin-tazobactam</li>
                <li>Vancomycin (if MRSA risk)</li>
                <li>Consider vasopressors if MAP remains low after fluid resuscitation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">Medical Disclaimer</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              This report is generated by an AI system and is intended for informational purposes only. It is not a
              substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified
              healthcare provider with any questions regarding a medical condition.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}