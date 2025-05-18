import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PredictionResult {
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

interface PredictionState {
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: PredictionState = {
  result: null,
  loading: false,
  error: null,
};

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setPredictionResult(state, action: PayloadAction<PredictionResult>) {
      state.result = action.payload;
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
      state.result = null;
      state.error = null;
    },
  },
});

export const {
  setPredictionResult,
  setPredictionLoading,
  setPredictionError,
  clearPredictionResult,
} = predictionSlice.actions;

export default predictionSlice.reducer;