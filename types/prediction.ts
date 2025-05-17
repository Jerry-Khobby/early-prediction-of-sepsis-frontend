export interface TimeSeriesFeatures {
  HR: number;
  MAP: number;
  O2Sat: number;
  SBP: number;
  Resp: number;
}

export interface CategoricalFeatures {
  Unit1: number;
  Gender: number;
  HospAdmTime: number;
  Age: number;
  DBP: number;
  Temp: number;
  Glucose: number;
  Potassium: number;
  Hct: number;
  FiO2: number;
  Hgb: number;
  pH: number;
  BUN: number;
  WBC: number;
  Magnesium: number;
  Creatinine: number;
  Platelets: number;
  Calcium: number;
  PaCO2: number;
  BaseExcess: number;
  Chloride: number;
  HCO3: number;
  Phosphate: number;
  EtCO2: number;
  SaO2: number;
  PTT: number;
  Lactate: number;
  AST: number;
  Alkalinephos: number;
  Bilirubin_total: number;
  TroponinI: number;
  Fibrinogen: number;
  Bilirubin_direct: number;
}

export interface TopFeatures {
  [key: string]: number;
}

export interface ShapValues {
  time_series: TimeSeriesFeatures;
  categorical: CategoricalFeatures;
  top_features: TopFeatures;
}

export interface Metrics {
  auc: number;
}

export interface PredictionData {
  auc: number;
  threshold: number;
  metrics: Metrics;
  shap_values: ShapValues;
}

export interface PredictionState {
  data: PredictionData | null;
  loading: boolean;
  error: string | null;
}