"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import { TabsContent } from "@/components/ui/tabs";
import { Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BASE_API_URL } from "@/lib/constant";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hook";
import {
  setCsvPredictionResult,
  setPredictionLoading,
  setPredictionError,
} from "@/lib/store/prediction";

const UploadCsv = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isValidCsvFile = (file: File): boolean => {
    return file.name.toLowerCase().endsWith(".csv");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidCsvFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidCsvFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        // Reset the input
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    // Double-check file type before submitting
    if (!isValidCsvFile(file)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const predictionResponse = await fetch(
        `${BASE_API_URL}/api/v1/csv_predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!predictionResponse.ok) {
        const errorData = await predictionResponse.json();
        throw new Error(errorData.detail || "Failed to run prediction");
      }

      const predictionResult = await predictionResponse.json();
      //2.
      const reportResponse = await fetch(
        `${BASE_API_URL}/api/v1/reports/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(predictionResult),
        }
      );
      if (!reportResponse.ok) {
        const errorData = await reportResponse.json();
        throw new Error(errorData.detail || "Failed to submit report");
      }
      const finalResult = await reportResponse.json();
      dispatch(setCsvPredictionResult(finalResult));

      toast({
        title: "Prediction Successful",
        description: "The prediction has been completed successfully.",
        variant: "default",
      });
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch(setPredictionError(errorMessage));
      toast({
        title: "Prediction Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Button
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                asChild
              >
                <Label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                </Label>
              </Button>
            </div>
            {file && (
              <motion.div
                className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-medium text-teal-700 dark:text-teal-300">
                  Selected file:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {file.name}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
          <Button
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            disabled={!file || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Run Prediction <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </TabsContent>
  );
};

export default UploadCsv;
