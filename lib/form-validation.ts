// lib/form-validation.ts

// Define the shape of a validation rule
type ValidationRule = {
  min: number;
  max: number;
  integer?: boolean;
  required?: boolean;
  count?: number; // For time series fields
};

// Export the validation rules for all fields
export const validationRules: Record<string, ValidationRule> = {
  // Demographics
  Unit1: { min: 0, max: 1, integer: true, required: true },
  Gender: { min: 0, max: 1, integer: true, required: true },
  HospAdmTime: { min: 0, max: 8760, required: true }, // 0 to 1 year in hours
  Age: { min: 0, max: 120, integer: true, required: true },

  // Vital Signs
  DBP: { min: 20, max: 200, integer: true, required: true },
  Temp: { min: 25, max: 45, required: true },

  // Time Series (10 readings each)
  HR: { min: 20, max: 300, integer: true, required: true, count: 10 },
  MAP: { min: 30, max: 200, integer: true, required: true, count: 10 },
  O2Sat: { min: 50, max: 100, integer: true, required: true, count: 10 },
  SBP: { min: 50, max: 300, integer: true, required: true, count: 10 },
  Resp: { min: 5, max: 60, integer: true, required: true, count: 10 },

  // Blood Chemistry
  Glucose: { min: 30, max: 800, integer: true, required: true },
  Potassium: { min: 1.5, max: 8.0, required: true },
  Hct: { min: 10, max: 70, integer: true, required: true },
  FiO2: { min: 0.21, max: 1.0, required: true },
  Hgb: { min: 3, max: 25, required: true },
  pH: { min: 6.8, max: 8.0, required: true },
  BUN: { min: 2, max: 200, integer: true, required: true },
  WBC: { min: 0.1, max: 100, required: true },
  Magnesium: { min: 0.5, max: 5.0, required: true },
  Creatinine: { min: 0.1, max: 20, required: true },
  Platelets: { min: 10, max: 2000, integer: true, required: true },
  Calcium: { min: 5, max: 15, required: true },
  PaCO2: { min: 10, max: 100, integer: true, required: true },
  BaseExcess: { min: -30, max: 30, required: true },
  Chloride: { min: 70, max: 130, integer: true, required: true },
  HCO3: { min: 5, max: 50, integer: true, required: true },
  Phosphate: { min: 0.5, max: 10, required: true },
  EtCO2: { min: 10, max: 80, integer: true, required: true },
  SaO2: { min: 50, max: 100, integer: true, required: true },
  PTT: { min: 10, max: 200, integer: true, required: true },
  Lactate: { min: 0.1, max: 30, required: true },
  AST: { min: 1, max: 5000, integer: true, required: true },
  Alkalinephos: { min: 10, max: 2000, integer: true, required: true },
  Bilirubin_total: { min: 0.1, max: 50, required: true },
  TroponinI: { min: 0, max: 100, required: true },
  Fibrinogen: { min: 50, max: 1000, integer: true, required: true },
  Bilirubin_direct: { min: 0, max: 30, required: true },
};

// Validation function
export const validateField = (
  fieldName: string,
  value: string | number,
  index?: number
): string | null => {
  const rules = validationRules[fieldName];
  if (!rules) return null;

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Required check
  if (
    rules.required &&
    (value === "" || value === null || value === undefined || isNaN(numValue))
  ) {
    return `${fieldName} is required`;
  }

  // Skip further checks if not required and empty
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }

  if (rules.integer && !Number.isInteger(numValue)) {
    return `${fieldName} must be a whole number`;
  }

  if (rules.min !== undefined && numValue < rules.min) {
    return `${fieldName} must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && numValue > rules.max) {
    return `${fieldName} must be at most ${rules.max}`;
  }

  return null;
};
