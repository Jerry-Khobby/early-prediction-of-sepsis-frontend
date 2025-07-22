import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Updated interfaces to match actual backend response
export interface PatientReport {
  patient_id: number;
  report_type?: string;
  generated_at?: string;
  risk_probability: string;
  risk_assessment: {
    level: string;
    score: number | string; // Can be number or formatted string like "🟨Moderate (74.59%)"
    time_frame: string;
    interpretation: string;
    detailed_analysis: string;
  };
  key_risk_factors: Array<{
    marker: string;
    importance: number;
    note: string;
  }>;
  clinical_guidance: {
    monitoring: string[];
    diagnostic_tests: string[];
    treatment_options: {
      immediate_medications: string[];
      antibiotic_choices: string[] | {
        community_acquired?: string[];
        hospital_acquired?: string[];
        penicillin_allergy?: string[];
      };
    };
    required_actions: string[];
  };
  safety_alerts: {
    precautions: string[];
  };
  disclaimers: {
    model_use: string;
    physician_oversight: string;
    limitations: string;
  };
}

export interface CsvPredictionResult {
  patient_id: number;
  success: boolean;
  report: PatientReport;
  risk_level: string; // e.g., "🟨Moderate"
  probability: number; // decimal format like 0.7259972095489502
}

// Meta info for CSV batch prediction
export interface CsvPredictionMeta {
  threshold_used: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    auc: number;
    confusion_matrix: number[][];
  };
  total_patients: number;
  successful_reports: number;
  failed_reports: number;
}

// Full CSV prediction response - matches your backend exactly
export interface CsvPredictionResponse {
  success: boolean;
  reports: CsvPredictionResult[];
  errors: any[]; // Array of any error objects
  meta: CsvPredictionMeta;
}
interface ManualPredictionResult {
  risk_assessment: {
    score: number;
    level: string;
    time_frame: string;
    interpretation: string;
    detailed_analysis:string;
  };
  key_risk_factors: Array<{
    feature: string;
    value: number;
  }>;
  clinical_guidance: {
    monitoring: string[];
    diagnostic_tests: string[];
    treatment_options: {
      immediate_medications: string[];
      antibiotic_choices: {
        community_acquired:string[];
        hospital_acquired:string[];
        penicillin_allergy:string[];
      };
    };
    required_actions: string[];
  };
  safety_alerts: string[];
  disclaimers: string[];
}

interface PredictionState {
csvResult: CsvPredictionResponse | null;
manualResult: ManualPredictionResult | null;
loading: boolean;
  error: string | null;
  predictionType: 'csv' | 'manual' | null;
  selectedPatientId: number | null;
}

const initialState: PredictionState = {
  csvResult: null,
  manualResult: null,
  loading: false,
  error: null,
  predictionType: null,
  selectedPatientId:null,
};

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setCsvPredictionResult(state, action: PayloadAction<CsvPredictionResponse>) {
      state.csvResult = action.payload;
      state.manualResult = null;
      state.predictionType = 'csv';
      state.loading = false;
      state.error = null;
      if (action.payload.reports && action.payload.reports.length > 0) {
        state.selectedPatientId = action.payload.reports[0].patient_id;
      }
      
    },
    setManualPredictionResult(state, action: PayloadAction<ManualPredictionResult>) {
      state.manualResult = action.payload;
      state.csvResult = null;
      state.predictionType = 'manual';
      state.loading = false;
      state.error = null;
    },
    setPredictionLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setPredictionError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearPredictionResult(state) {
      state.csvResult = null;
      state.manualResult = null;
      state.predictionType = null;
      state.error = null;
    },

        // Set selected patient for CSV results
    setSelectedPatient(state, action: PayloadAction<number>) {
      if (state.csvResult && state.csvResult.reports) {
        const patientExists = state.csvResult.reports.some(
          report => report.patient_id === action.payload
        );
        if (patientExists) {
          state.selectedPatientId = action.payload;
        }
      }
    },
    
    // Update specific patient report (useful for real-time updates)
    updatePatientReport(state, action: PayloadAction<{ patientId: number; report: Partial<PatientReport> }>) {
      if (state.csvResult && state.csvResult.reports) {
        const patientIndex = state.csvResult.reports.findIndex(
          report => report.patient_id === action.payload.patientId
        );
        if (patientIndex !== -1) {
          state.csvResult.reports[patientIndex].report = {
            ...state.csvResult.reports[patientIndex].report,
            ...action.payload.report
          };
        }
      }
    }
  },
});




export const {
  setCsvPredictionResult,
  setManualPredictionResult,
  setPredictionLoading,
  setPredictionError,
  clearPredictionResult,
  setSelectedPatient,
  updatePatientReport,
} = predictionSlice.actions;



// Selectors for easier data access
export const selectCsvResults = (state: { prediction: PredictionState }) => 
  state.prediction.csvResult;

export const selectSelectedPatient = (state: { prediction: PredictionState }) => {
  if (!state.prediction.csvResult || !state.prediction.selectedPatientId) {
    return null;
  }
  return state.prediction.csvResult.reports.find(
    report => report.patient_id === state.prediction.selectedPatientId
  ) || null;
};

export const selectPredictionMeta = (state: { prediction: PredictionState }) =>
  state.prediction.csvResult?.meta;

export const selectPredictionErrors = (state: { prediction: PredictionState }) =>
  state.prediction.csvResult?.errors;

export default predictionSlice.reducer;

