import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CsvPredictionResult {
  auc: number;
  threshold: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    auc: number;
    confusion_matrix: number[][];
  };
  shap_values: {
    time_series: Record<string, number>;
    categorical: Record<string, number>;
    top_features: Record<string, number>;
  };
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
        pencillin_allergy:string[];
      };
    };
    required_actions: string[];
  };
  safety_alerts: string[];
  disclaimers: string[];
}

interface PredictionState {
  csvResult: CsvPredictionResult | null;
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
    setCsvPredictionResult(state, action: PayloadAction<CsvPredictionResult>) {
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