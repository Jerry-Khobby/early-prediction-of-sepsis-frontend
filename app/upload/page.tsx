"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileUp, Table, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Progress } from "@/components/ui/progress"

interface FormData {
  // High correlation arrays
  HR: string[]
  MAP: string[]
  O2Sat: string[]
  SBP: string[]
  Resp: string[]
  // Demographics
  Unit1: string
  Gender: string
  HospAdmTime: string
  Age: string
  // Vital signs
  DBP: string
  Temp: string
  // Blood chemistry
  Glucose: string
  Potassium: string
  Hct: string
  FiO2: string
  Hgb: string
  pH: string
  BUN: string
  WBC: string
  Magnesium: string
  Creatinine: string
  Platelets: string
  Calcium: string
  PaCO2: string
  BaseExcess: string
  Chloride: string
  HCO3: string
  Phosphate: string
  EtCO2: string
  SaO2: string
  PTT: string
  Lactate: string
  AST: string
  Alkalinephos: string
  Bilirubin_total: string
  TroponinI: string
  Fibrinogen: string
  Bilirubin_direct: string
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const { register, watch, formState: { isValid } } = useForm<FormData>({
    mode: "onChange"
  })

  // Watch all form fields to determine if the form is valid
  const formValues = watch()

  // Calculate form completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0
      let completedFields = 0

      // Check high correlation arrays (each needs 10 values)
      const timeSeriesFields = ["HR", "MAP", "O2Sat", "SBP", "Resp"]
      timeSeriesFields.forEach(field => {
        const values = formValues[field as keyof FormData] as string[]
        if (values) {
          totalFields += 10
          completedFields += values.filter(v => v && v.trim() !== "").length
        }
      })

      // Check other fields
      const otherFields = [
        "Unit1", "Gender", "HospAdmTime", "Age", "DBP", "Temp",
        "Glucose", "Potassium", "Hct", "FiO2", "Hgb", "pH", "BUN",
        "WBC", "Magnesium", "Creatinine", "Platelets", "Calcium",
        "PaCO2", "BaseExcess", "Chloride", "HCO3", "Phosphate",
        "EtCO2", "SaO2", "PTT", "Lactate", "AST", "Alkalinephos",
        "Bilirubin_total", "TroponinI", "Fibrinogen", "Bilirubin_direct"
      ]

      otherFields.forEach(field => {
        totalFields++
        const value = formValues[field as keyof FormData]
        if (value && value.toString().trim() !== "") {
          completedFields++
        }
      })

      const percentage = (completedFields / totalFields) * 100
      setCompletionPercentage(Math.round(percentage))
    }

    calculateCompletion()
  }, [formValues])

  const isFormValid = () => {
    return completionPercentage === 100
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const renderTimeSeriesInputs = (name: keyof Pick<FormData, "HR" | "MAP" | "O2Sat" | "SBP" | "Resp">, label: string, unit: string) => {
    return (
      <div className="space-y-2">
        <Label>{label} ({unit})</Label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Label className="text-xs text-muted-foreground">Reading {index + 1}</Label>
              <Input
                {...register(`${name}.${index}`)}
                type="number"
                className="h-8"
                placeholder={`#${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Patient Data Input</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Upload patient data or enter vitals manually to get sepsis risk prediction
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="overflow-hidden">
              <motion.div
                className={`p-8 border-2 border-dashed rounded-lg ${
                  isDragging
                    ? "border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-900/20"
                    : "border-gray-200 dark:border-gray-800"
                } transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-teal-100 p-3 dark:bg-teal-900/30">
                    <Upload className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Upload Patient Data</h3>
                  <p className="mb-6 text-sm text-muted-foreground dark:text-gray-400">
                    Drag and drop your CSV file here, or click to browse
                  </p>

                  <Input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  <Label htmlFor="file-upload" asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
                      Browse Files
                    </Button>
                  </Label>

                  {file && (
                    <motion.div
                      className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-medium text-teal-700 dark:text-teal-300">Selected file:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{file.name}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <div className="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  disabled={!file}
                >
                  <span className="flex items-center gap-2">
                    Run Prediction <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Enter Patient Data</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Form Completion: {completionPercentage}%
                    </span>
                    <Progress value={completionPercentage} className="w-[100px]" />
                  </div>
                </div>

                <form className="space-y-8">
                  {/* High Correlation Section */}
                  <div className="space-y-6">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">High Correlation Values (10 readings each)</h4>
                    <div className="space-y-6">
                      {renderTimeSeriesInputs("HR", "Heart Rate", "bpm")}
                      {renderTimeSeriesInputs("MAP", "Mean Arterial Pressure", "mmHg")}
                      {renderTimeSeriesInputs("O2Sat", "O2 Saturation", "%")}
                      {renderTimeSeriesInputs("SBP", "Systolic Blood Pressure", "mmHg")}
                      {renderTimeSeriesInputs("Resp", "Respiratory Rate", "bpm")}
                    </div>
                  </div>

                  {/* Demographics Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Demographics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="unit1">Unit</Label>
                        <Input {...register("Unit1")} id="unit1" type="number" placeholder="e.g., 1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender (0=Female, 1=Male)</Label>
                        <Input {...register("Gender")} id="gender" type="number" placeholder="0 or 1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospAdmTime">Hospital Admission Time (hours)</Label>
                        <Input {...register("HospAdmTime")} id="hospAdmTime" type="number" step="0.1" placeholder="e.g., 24.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input {...register("Age")} id="age" type="number" placeholder="e.g., 65" />
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Vital Signs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dbp">Diastolic Blood Pressure (mmHg)</Label>
                        <Input {...register("DBP")} id="dbp" type="number" placeholder="e.g., 80" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp">Temperature (°C)</Label>
                        <Input {...register("Temp")} id="temp" type="number" step="0.1" placeholder="e.g., 37.2" />
                      </div>
                    </div>
                  </div>

                  {/* Blood Chemistry Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Blood Chemistry</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                        <Input {...register("Glucose")} id="glucose" type="number" placeholder="e.g., 110" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potassium">Potassium (mEq/L)</Label>
                        <Input {...register("Potassium")} id="potassium" type="number" step="0.1" placeholder="e.g., 4.2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hct">Hematocrit (%)</Label>
                        <Input {...register("Hct")} id="hct" type="number" placeholder="e.g., 38" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fio2">FiO2</Label>
                        <Input {...register("FiO2")} id="fio2" type="number" step="0.1" placeholder="e.g., 0.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hgb">Hemoglobin (g/dL)</Label>
                        <Input {...register("Hgb")} id="hgb" type="number" step="0.1" placeholder="e.g., 12.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ph">pH</Label>
                        <Input {...register("pH")} id="ph" type="number" step="0.1" placeholder="e.g., 7.4" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bun">BUN (mg/dL)</Label>
                        <Input {...register("BUN")} id="bun" type="number" placeholder="e.g., 18" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wbc">WBC (K/uL)</Label>
                        <Input {...register("WBC")} id="wbc" type="number" step="0.1" placeholder="e.g., 8.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="magnesium">Magnesium (mg/dL)</Label>
                        <Input {...register("Magnesium")} id="magnesium" type="number" step="0.1" placeholder="e.g., 2.1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                        <Input {...register("Creatinine")} id="creatinine" type="number" step="0.1" placeholder="e.g., 1.2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platelets">Platelets (K/uL)</Label>
                        <Input {...register("Platelets")} id="platelets" type="number" placeholder="e.g., 250" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calcium">Calcium (mg/dL)</Label>
                        <Input {...register("Calcium")} id="calcium" type="number" step="0.1" placeholder="e.g., 9.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paco2">PaCO2 (mmHg)</Label>
                        <Input {...register("PaCO2")} id="paco2" type="number" placeholder="e.g., 40" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="baseExcess">Base Excess (mEq/L)</Label>
                        <Input {...register("BaseExcess")} id="baseExcess" type="number" placeholder="e.g., 0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chloride">Chloride (mEq/L)</Label>
                        <Input {...register("Chloride")} id="chloride" type="number" placeholder="e.g., 100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hco3">HCO3 (mEq/L)</Label>
                        <Input {...register("HCO3")} id="hco3" type="number" placeholder="e.g., 24" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phosphate">Phosphate (mg/dL)</Label>
                        <Input {...register("Phosphate")} id="phosphate" type="number" step="0.1" placeholder="e.g., 3.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="etco2">EtCO2 (mmHg)</Label>
                        <Input {...register("EtCO2")} id="etco2" type="number" placeholder="e.g., 35" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sao2">SaO2 (%)</Label>
                        <Input {...register("SaO2")} id="sao2" type="number" placeholder="e.g., 97" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ptt">PTT (seconds)</Label>
                        <Input {...register("PTT")} id="ptt" type="number" placeholder="e.g., 30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lactate">Lactate (mmol/L)</Label>
                        <Input {...register("Lactate")} id="lactate" type="number" step="0.1" placeholder="e.g., 1.5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ast">AST (U/L)</Label>
                        <Input {...register("AST")} id="ast" type="number" placeholder="e.g., 25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alkalinephos">Alkaline Phosphatase (U/L)</Label>
                        <Input {...register("Alkalinephos")} id="alkalinephos" type="number" placeholder="e.g., 80" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bilirubin_total">Total Bilirubin (mg/dL)</Label>
                        <Input {...register("Bilirubin_total")} id="bilirubin_total" type="number" step="0.1" placeholder="e.g., 0.8" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="troponini">Troponin I (ng/mL)</Label>
                        <Input {...register("TroponinI")} id="troponini" type="number" step="0.01" placeholder="e.g., 0.01" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fibrinogen">Fibrinogen (mg/dL)</Label>
                        <Input {...register("Fibrinogen")} id="fibrinogen" type="number" placeholder="e.g., 300" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bilirubin_direct">Direct Bilirubin (mg/dL)</Label>
                        <Input {...register("Bilirubin_direct")} id="bilirubin_direct" type="number" step="0.1" placeholder="e.g., 0.2" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {completionPercentage === 100 
                    ? "All required fields are filled"
                    : `${completionPercentage}% of required fields are filled`}
                </div>
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  disabled={!isFormValid()}
                >
                  <span className="flex items-center gap-2">
                    Run Prediction <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
