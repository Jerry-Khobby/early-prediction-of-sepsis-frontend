"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileUp, Table, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { FormData } from "@/lib/form-type";
import { transformFormData } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AlertCircle } from "lucide-react";
import {
  setManualPredictionResult,
  setPredictionError,
} from "@/lib/store/prediction";
import { useToast } from "./ui/use-toast";
import { BASE_API_URL } from "@/lib/constant";
import { useAppDispatch } from "@/lib/store/hook";
import { useRouter } from "next/navigation";
import { validationRules, validateField } from "@/lib/form-validation";

const UploadManual = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
  });

  // Watch all form fields to determine if the form is valid
  const formValues = watch();

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Validate all fields
    Object.keys(validationRules).forEach((fieldName) => {
      const rules = validationRules[fieldName as keyof typeof validationRules];

      if (rules.count) {
        // Handle time series fields (arrays)
        const values = formValues[fieldName as keyof FormData] as string[];
        if (values) {
          values.forEach((value, index) => {
            const error = validateField(fieldName, value, index);
            if (error) {
              newErrors[`${fieldName}.${index}`] = error;
            }
          });
        }
      } else {
        // Handle single value fields
        const value = formValues[fieldName as keyof FormData];
        const error = validateField(fieldName, value as string);
        if (error) {
          newErrors[fieldName] = error;
        }
      }
    });

    setFieldErrors(newErrors);
  }, [formValues]);

  // Calculate form completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0;
      let completedFields = 0;

      // Check high correlation arrays (each needs 10 values)
      const timeSeriesFields = ["HR", "MAP", "O2Sat", "SBP", "Resp"];
      timeSeriesFields.forEach((field) => {
        const values = formValues[field as keyof FormData] as string[];
        if (values) {
          totalFields += 10;
          completedFields += values.filter((v) => v && v.trim() !== "").length;
        }
      });

      // Check other fields
      const otherFields = [
        "Unit1",
        "Gender",
        "HospAdmTime",
        "Age",
        "DBP",
        "Temp",
        "Glucose",
        "Potassium",
        "Hct",
        "FiO2",
        "Hgb",
        "pH",
        "BUN",
        "WBC",
        "Magnesium",
        "Creatinine",
        "Platelets",
        "Calcium",
        "PaCO2",
        "BaseExcess",
        "Chloride",
        "HCO3",
        "Phosphate",
        "EtCO2",
        "SaO2",
        "PTT",
        "Lactate",
        "AST",
        "Alkalinephos",
        "Bilirubin_total",
        "TroponinI",
        "Fibrinogen",
        "Bilirubin_direct",
      ];

      otherFields.forEach((field) => {
        totalFields++;
        const value = formValues[field as keyof FormData];
        if (value && value.toString().trim() !== "") {
          completedFields++;
        }
      });

      const percentage = (completedFields / totalFields) * 100;
      setCompletionPercentage(Math.round(percentage));
    };

    calculateCompletion();
  }, [formValues]);

  const isFormValid = () => {
    return (
      completionPercentage === 100 && Object.keys(fieldErrors).length === 0
    );
  };

  const renderTimeSeriesInputs = (
    name: keyof Pick<FormData, "HR" | "MAP" | "O2Sat" | "SBP" | "Resp">,
    label: string,
    unit: string
  ) => {
    const rules = validationRules[name];
    return (
      <div className="space-y-2">
        <Label>
          {label} ({unit}) - Range: {rules.min}-{rules.max}
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Reading {index + 1}
              </Label>
              <div className="relative">
                <Input
                  {...register(`${name}.${index}`)}
                  type="number"
                  className={`h-8 ${fieldErrors[`${name}.${index}`] ? "" : ""}`}
                  placeholder={`#${index + 1}`}
                  min={rules.min}
                  max={rules.max}
                  step={rules.integer ? "1" : "0.1"}
                />
                {fieldErrors[`${name}.${index}`] && (
                  <AlertCircle className="absolute right-2 top-2 h-4 w-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInput = (
    fieldName: keyof FormData,
    label: string,
    placeholder: string,
    unit?: string
  ) => {
    const rules = validationRules[fieldName as keyof typeof validationRules];
    const displayLabel = unit ? `${label} (${unit})` : label;
    const rangeInfo = rules ? ` - Range: ${rules.min}-${rules.max}` : "";

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName}>
          {displayLabel}
          {rangeInfo}
        </Label>
        <div className="relative">
          <Input
            {...register(fieldName)}
            id={fieldName}
            type="number"
            placeholder={placeholder}
            className={fieldErrors[fieldName] ? "border-red-500" : ""}
            min={rules?.min}
            max={rules?.max}
            step={rules?.integer ? "1" : "0.1"}
          />
          {fieldErrors[fieldName] && (
            <AlertCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
          )}
        </div>
        {fieldErrors[fieldName] && (
          <p className="text-xs text-red-500">{fieldErrors[fieldName]}</p>
        )}
      </div>
    );
  };

  const onSubmit = async (data: FormData) => {
    if (Object.keys(fieldErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload = transformFormData(data);
      const response = await fetch(`${BASE_API_URL}/api/v1/manual_predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to run prediction");
      }
      const result = await response.json();
      dispatch(setManualPredictionResult(result));
      toast({
        title: "Prediction Successful",
        description: "The prediction has been successfully completed.",
        variant: "default",
      });
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occured";
      dispatch(setPredictionError(errorMessage));
      toast({
        title: "Prediction Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occured",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const errorCount = Object.keys(fieldErrors).length;
  return (
    <TabsContent value="manual">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Enter Patient Data</h3>
            <div className="flex items-center gap-4">
              {errorCount > 0 && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {errorCount} validation errors
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground ">
                  Form Completion: {completionPercentage}%
                </span>
                <Progress
                  value={completionPercentage}
                  className="w-[100px] [&>div]:bg-[#44bfb2] "
                />
              </div>
            </div>
          </div>

          <form className="space-y-8">
            {/* High Correlation Section */}
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                High Correlation Values (10 readings each)
              </h4>
              <div className="space-y-6">
                {renderTimeSeriesInputs("HR", "Heart Rate", "bpm")}
                {renderTimeSeriesInputs(
                  "MAP",
                  "Mean Arterial Pressure",
                  "mmHg"
                )}
                {renderTimeSeriesInputs("O2Sat", "O2 Saturation", "%")}
                {renderTimeSeriesInputs(
                  "SBP",
                  "Systolic Blood Pressure",
                  "mmHg"
                )}
                {renderTimeSeriesInputs("Resp", "Respiratory Rate", "bpm")}
              </div>
            </div>

            {/* Demographics Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Demographics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit1">Unit</Label>
                  <Input
                    {...register("Unit1")}
                    id="unit1"
                    type="number"
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender (0=Female, 1=Male)</Label>
                  <Input
                    {...register("Gender")}
                    id="gender"
                    type="number"
                    placeholder="0 or 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospAdmTime">
                    Hospital Admission Time (hours)
                  </Label>
                  <Input
                    {...register("HospAdmTime")}
                    id="hospAdmTime"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 24.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    {...register("Age")}
                    id="age"
                    type="number"
                    placeholder="e.g., 65"
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Vital Signs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dbp">Diastolic Blood Pressure (mmHg)</Label>
                  <Input
                    {...register("DBP")}
                    id="dbp"
                    type="number"
                    placeholder="e.g., 80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp">Temperature (°C)</Label>
                  <Input
                    {...register("Temp")}
                    id="temp"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 37.2"
                  />
                </div>
              </div>
            </div>

            {/* Blood Chemistry Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Blood Chemistry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                  <Input
                    {...register("Glucose")}
                    id="glucose"
                    type="number"
                    placeholder="e.g., 110"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (mEq/L)</Label>
                  <Input
                    {...register("Potassium")}
                    id="potassium"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 4.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hct">Hematocrit (%)</Label>
                  <Input
                    {...register("Hct")}
                    id="hct"
                    type="number"
                    placeholder="e.g., 38"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fio2">FiO2</Label>
                  <Input
                    {...register("FiO2")}
                    id="fio2"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hgb">Hemoglobin (g/dL)</Label>
                  <Input
                    {...register("Hgb")}
                    id="hgb"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">pH</Label>
                  <Input
                    {...register("pH")}
                    id="ph"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bun">BUN (mg/dL)</Label>
                  <Input
                    {...register("BUN")}
                    id="bun"
                    type="number"
                    placeholder="e.g., 18"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wbc">WBC (K/uL)</Label>
                  <Input
                    {...register("WBC")}
                    id="wbc"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="magnesium">Magnesium (mg/dL)</Label>
                  <Input
                    {...register("Magnesium")}
                    id="magnesium"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                  <Input
                    {...register("Creatinine")}
                    id="creatinine"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platelets">Platelets (K/uL)</Label>
                  <Input
                    {...register("Platelets")}
                    id="platelets"
                    type="number"
                    placeholder="e.g., 250"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calcium">Calcium (mg/dL)</Label>
                  <Input
                    {...register("Calcium")}
                    id="calcium"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 9.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paco2">PaCO2 (mmHg)</Label>
                  <Input
                    {...register("PaCO2")}
                    id="paco2"
                    type="number"
                    placeholder="e.g., 40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseExcess">Base Excess (mEq/L)</Label>
                  <Input
                    {...register("BaseExcess")}
                    id="baseExcess"
                    type="number"
                    placeholder="e.g., 0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chloride">Chloride (mEq/L)</Label>
                  <Input
                    {...register("Chloride")}
                    id="chloride"
                    type="number"
                    placeholder="e.g., 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hco3">HCO3 (mEq/L)</Label>
                  <Input
                    {...register("HCO3")}
                    id="hco3"
                    type="number"
                    placeholder="e.g., 24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphate">Phosphate (mg/dL)</Label>
                  <Input
                    {...register("Phosphate")}
                    id="phosphate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etco2">EtCO2 (mmHg)</Label>
                  <Input
                    {...register("EtCO2")}
                    id="etco2"
                    type="number"
                    placeholder="e.g., 35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sao2">SaO2 (%)</Label>
                  <Input
                    {...register("SaO2")}
                    id="sao2"
                    type="number"
                    placeholder="e.g., 97"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ptt">PTT (seconds)</Label>
                  <Input
                    {...register("PTT")}
                    id="ptt"
                    type="number"
                    placeholder="e.g., 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lactate">Lactate (mmol/L)</Label>
                  <Input
                    {...register("Lactate")}
                    id="lactate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ast">AST (U/L)</Label>
                  <Input
                    {...register("AST")}
                    id="ast"
                    type="number"
                    placeholder="e.g., 25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alkalinephos">
                    Alkaline Phosphatase (U/L)
                  </Label>
                  <Input
                    {...register("Alkalinephos")}
                    id="alkalinephos"
                    type="number"
                    placeholder="e.g., 80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilirubin_total">
                    Total Bilirubin (mg/dL)
                  </Label>
                  <Input
                    {...register("Bilirubin_total")}
                    id="bilirubin_total"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 0.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="troponini">Troponin I (ng/mL)</Label>
                  <Input
                    {...register("TroponinI")}
                    id="troponini"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fibrinogen">Fibrinogen (mg/dL)</Label>
                  <Input
                    {...register("Fibrinogen")}
                    id="fibrinogen"
                    type="number"
                    placeholder="e.g., 300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilirubin_direct">
                    Direct Bilirubin (mg/dL)
                  </Label>
                  <Input
                    {...register("Bilirubin_direct")}
                    id="bilirubin_direct"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 0.2"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {isFormValid()
              ? "All required fields are filled and valid"
              : errorCount > 0
              ? `${errorCount} validation errors need to be fixed`
              : `${completionPercentage}% of required fields are filled`}
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            disabled={!isFormValid() || isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
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

export default UploadManual;
