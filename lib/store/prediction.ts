import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CsvPredictionResult {
  patient_id: number;
  risk_level: string;
  probability: number;
  success: boolean;
  report: {
    patient_report: {
      patient_id: number;
      report_type: string;
      generated_at?: string;
      risk_probability: string;
      risk_assessment: {
        level: string;
        score: number | string;
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
    };
  };
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

// Full CSV prediction response
export interface CsvPredictionResultBatch {
  success: boolean;
  reports: CsvPredictionResult[];
  errors: any[];
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
 csvResult: CsvPredictionResultBatch | null;
  manualResult: ManualPredictionResult | null;
  loading: boolean;
  error: string | null;
  predictionType: 'csv' | 'manual' | null;
}

const initialState: PredictionState = {
  csvResult: null,
  manualResult: null,
  loading: false,
  error: null,
  predictionType: null,
};

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setCsvPredictionResult(state, action: PayloadAction<CsvPredictionResultBatch>) {
      state.csvResult = action.payload;
      state.manualResult = null;
      state.predictionType = 'csv';
      state.loading = false;
      state.error = null;
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
  },
});

export const {
  setCsvPredictionResult,
  setManualPredictionResult,
  setPredictionLoading,
  setPredictionError,
  clearPredictionResult,
} = predictionSlice.actions;

export default predictionSlice.reducer;