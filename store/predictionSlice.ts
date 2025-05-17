import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PredictionData, PredictionState } from '../types/prediction';

const initialState: PredictionState = {
  data: null,
  loading: false,
  error: null,
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    fetchPredictionStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPredictionSuccess(state, action: PayloadAction<PredictionData>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPredictionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPrediction(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchPredictionStart,
  fetchPredictionSuccess,
  fetchPredictionFailure,
  clearPrediction,
} = predictionSlice.actions;

export default predictionSlice.reducer;