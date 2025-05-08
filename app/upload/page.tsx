"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileUp, Table, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
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
                <h3 className="text-lg font-semibold mb-4">Enter Patient Vitals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hr">Heart Rate (bpm)</Label>
                    <Input id="hr" type="number" placeholder="e.g., 75" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="o2sat">O2 Saturation (%)</Label>
                    <Input id="o2sat" type="number" placeholder="e.g., 98" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temp">Temperature (°C)</Label>
                    <Input id="temp" type="number" step="0.1" placeholder="e.g., 37.0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="map">Mean Arterial Pressure (mmHg)</Label>
                    <Input id="map" type="number" placeholder="e.g., 90" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resp">Respiratory Rate (bpm)</Label>
                    <Input id="resp" type="number" placeholder="e.g., 18" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wbc">WBC Count (K/uL)</Label>
                    <Input id="wbc" type="number" step="0.1" placeholder="e.g., 7.5" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
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
