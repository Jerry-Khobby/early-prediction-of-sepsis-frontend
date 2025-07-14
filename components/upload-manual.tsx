"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileUp, Table, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { FormData } from "@/lib/form-type";
import { transformFormData } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
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
    setValue,
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: async (data) => {
      const errors: Record<string, any> = {};
      const values: Record<string, any> = {};

      // Validate each field
      Object.keys(data).forEach((fieldName) => {
        const fieldValue = data[fieldName as keyof FormData];
        
        if (Array.isArray(fieldValue)) {
          // Handle time series fields
          const fieldErrors: string[] = [];
          fieldValue.forEach((value, index) => {
            const error = validateField(fieldName, value || '', index);
            if (error) {
              fieldErrors[index] = error;
            }
          });
          
          if (fieldErrors.length > 0) {
            errors[fieldName] = { type: "validation", message: fieldErrors };
          }
          values[fieldName] = fieldValue;
        } else {
          // Handle regular fields
          const error = validateField(fieldName, fieldValue || '');
          if (error) {
            errors[fieldName] = { type: "validation", message: error };
          }
          values[fieldName] = fieldValue;
        }
      });

      return {
        values: Object.keys(errors).length === 0 ? values : {},
        errors,
      };
    },
  });

  // Watch all form fields to determine if the form is valid
  const formValues = watch();

  // Real-time validation for individual fields
  const validateSingleField = (fieldName: string, value: string | number | string[], index?: number) => {
    let error: string | null = null;
    
    if (Array.isArray(value)) {
      // Handle array validation (time series)
      if (index !== undefined) {
        error = validateField(fieldName, value[index], index);
      }
    } else {
      // Handle single value validation
      error = validateField(fieldName, value, index);
    }
    
    const errorKey = index !== undefined ? `${fieldName}.${index}` : fieldName;
    
    setFieldErrors(prev => ({
      ...prev,
      [errorKey]: error || ''
    }));
    
    return error;
  };

  // Calculate form completion percentage with validation
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0;
      let completedFields = 0;
      let validFields = 0;

      // Check high correlation arrays (each needs 10 values)
      const timeSeriesFields = ["HR", "MAP", "O2Sat", "SBP", "Resp"];
      timeSeriesFields.forEach((field) => {
        const values = formValues[field as keyof FormData] as string[];
        if (values) {
          totalFields += 10;
          values.forEach((value, index) => {
            if (value && value.trim() !== "") {
              completedFields++;
              const error = validateField(field, value || '', index);
              if (!error) validFields++;
            }
          });
        }
      });

      // Check other fields
      const otherFields = [
        "Unit1", "Gender", "HospAdmTime", "Age", "DBP", "Temp", "Glucose",
        "Potassium", "Hct", "FiO2", "Hgb", "pH", "BUN", "WBC", "Magnesium",
        "Creatinine", "Platelets", "Calcium", "PaCO2", "BaseExcess", "Chloride",
        "HCO3", "Phosphate", "EtCO2", "SaO2", "PTT", "Lactate", "AST",
        "Alkalinephos", "Bilirubin_total", "TroponinI", "Fibrinogen", "Bilirubin_direct",
      ];

      otherFields.forEach((field) => {
        totalFields++;
        const rawValue = formValues[field as keyof FormData];
        const value = Array.isArray(rawValue)?rawValue.join(",") : rawValue;
        if (value && value.toString().trim() !== "") {
          completedFields++;
          const error = validateField(field, value || '');
          if (!error) validFields++;
        }
      });

      const percentage = (completedFields / totalFields) * 100;
      setCompletionPercentage(Math.round(percentage));
    };

    calculateCompletion();
  }, [formValues]);

  const isFormValid = () => {
    // Check if all fields are completed and valid
    const hasErrors = Object.values(fieldErrors).some(error => error);
    return completionPercentage === 100 && !hasErrors;
  };

  const renderTimeSeriesInputs = (
    name: keyof Pick<FormData, "HR" | "MAP" | "O2Sat" | "SBP" | "Resp">,
    label: string,
    unit: string
  ) => {
    return (
      <div className="space-y-2">
        <Label>
          {label} ({unit})
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, index) => {
            const errorKey = `${name}.${index}`;
            const hasError = fieldErrors[errorKey];
            
            return (
              <div key={index} className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Reading {index + 1}
                </Label>
                <div className="relative">
                  <Input
                    {...register(`${name}.${index}`)}
                    type="number"
                    className={`h-8 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder={`#${index + 1}`}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue(`${name}.${index}`, value);
                      validateSingleField(name, value, index);
                    }}
                  />
                  {hasError && (
                    <AlertCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {hasError && (
                  <p className="text-xs text-red-500 mt-1">{hasError}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInputField = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    type: string = "number",
    step?: string
  ) => {
    const hasError = fieldErrors[name];
    
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <div className="relative">
          <Input
            {...register(name)}
            id={name}
            type={type}
            step={step}
            placeholder={placeholder}
            className={hasError ? 'border-red-500 focus:border-red-500' : ''}
            onChange={(e) => {
              const value = e.target.value;
              setValue(name, value);
              validateSingleField(name, value);
            }}
          />
          {hasError && (
            <AlertCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
          )}
        </div>
        {hasError && (
          <p className="text-xs text-red-500 mt-1">{hasError}</p>
        )}
      </div>
    );
  };

  const onSubmit = async (data: FormData) => {
    // Final validation before submission
    const allErrors: Record<string, string> = {};
    
    // Validate all fields one more time
    Object.keys(data).forEach((fieldName) => {
      const fieldValue = data[fieldName as keyof FormData];
      
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((value, index) => {
          const error = validateField(fieldName, value || '', index);
          if (error) {
            allErrors[`${fieldName}.${index}`] = error;
          }
        });
      } else {
        const error = validateField(fieldName, fieldValue || '');
        if (error) {
          allErrors[fieldName] = error;
        }
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before submitting.",
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
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch(setPredictionError(errorMessage));
      toast({
        title: "Prediction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="manual">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Enter Patient Data</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Form Completion: {completionPercentage}%
              </span>
              <Progress
                value={completionPercentage}
                className="w-[100px] [&>div]:bg-[#44bfb2]"
              />
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
                {renderTimeSeriesInputs("MAP", "Mean Arterial Pressure", "mmHg")}
                {renderTimeSeriesInputs("O2Sat", "O2 Saturation", "%")}
                {renderTimeSeriesInputs("SBP", "Systolic Blood Pressure", "mmHg")}
                {renderTimeSeriesInputs("Resp", "Respiratory Rate", "bpm")}
              </div>
            </div>

            {/* Demographics Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Demographics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderInputField("Unit1", "Unit", "e.g., 1")}
                {renderInputField("Gender", "Gender (0=Female, 1=Male)", "0 or 1")}
                {renderInputField("HospAdmTime", "Hospital Admission Time (hours)", "e.g., 24.5", "number", "0.1")}
                {renderInputField("Age", "Age", "e.g., 65")}
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Vital Signs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderInputField("DBP", "Diastolic Blood Pressure (mmHg)", "e.g., 80")}
                {renderInputField("Temp", "Temperature (°C)", "e.g., 37.2", "number", "0.1")}
              </div>
            </div>

            {/* Blood Chemistry Section */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Blood Chemistry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderInputField("Glucose", "Glucose (mg/dL)", "e.g., 110")}
                {renderInputField("Potassium", "Potassium (mEq/L)", "e.g., 4.2", "number", "0.1")}
                {renderInputField("Hct", "Hematocrit (%)", "e.g., 38")}
                {renderInputField("FiO2", "FiO2", "e.g., 0.5", "number", "0.1")}
                {renderInputField("Hgb", "Hemoglobin (g/dL)", "e.g., 12.5", "number", "0.1")}
                {renderInputField("pH", "pH", "e.g., 7.4", "number", "0.1")}
                {renderInputField("BUN", "BUN (mg/dL)", "e.g., 18")}
                {renderInputField("WBC", "WBC (K/uL)", "e.g., 8.5", "number", "0.1")}
                {renderInputField("Magnesium", "Magnesium (mg/dL)", "e.g., 2.1", "number", "0.1")}
                {renderInputField("Creatinine", "Creatinine (mg/dL)", "e.g., 1.2", "number", "0.1")}
                {renderInputField("Platelets", "Platelets (K/uL)", "e.g., 250")}
                {renderInputField("Calcium", "Calcium (mg/dL)", "e.g., 9.5", "number", "0.1")}
                {renderInputField("PaCO2", "PaCO2 (mmHg)", "e.g., 40")}
                {renderInputField("BaseExcess", "Base Excess (mEq/L)", "e.g., 0")}
                {renderInputField("Chloride", "Chloride (mEq/L)", "e.g., 100")}
                {renderInputField("HCO3", "HCO3 (mEq/L)", "e.g., 24")}
                {renderInputField("Phosphate", "Phosphate (mg/dL)", "e.g., 3.5", "number", "0.1")}
                {renderInputField("EtCO2", "EtCO2 (mmHg)", "e.g., 35")}
                {renderInputField("SaO2", "SaO2 (%)", "e.g., 97")}
                {renderInputField("PTT", "PTT (seconds)", "e.g., 30")}
                {renderInputField("Lactate", "Lactate (mmol/L)", "e.g., 1.5", "number", "0.1")}
                {renderInputField("AST", "AST (U/L)", "e.g., 25")}
                {renderInputField("Alkalinephos", "Alkaline Phosphatase (U/L)", "e.g., 80")}
                {renderInputField("Bilirubin_total", "Total Bilirubin (mg/dL)", "e.g., 0.8", "number", "0.1")}
                {renderInputField("TroponinI", "Troponin I (ng/mL)", "e.g., 0.01", "number", "0.01")}
                {renderInputField("Fibrinogen", "Fibrinogen (mg/dL)", "e.g., 300")}
                {renderInputField("Bilirubin_direct", "Direct Bilirubin (mg/dL)", "e.g., 0.2", "number", "0.1")}
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