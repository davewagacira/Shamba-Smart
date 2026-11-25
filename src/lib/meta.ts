import raw from "@/data/metadata.json";

export type CropFeature = "N" | "P" | "K" | "temperature" | "humidity" | "ph" | "rainfall";

type Metadata = {
  crop: {
    features: CropFeature[];
    classes: string[];
    ranges: Record<CropFeature, { min: number; max: number; median: number }>;
    crop_profiles: Record<string, Record<CropFeature, number>>;
    crop_iqr: Record<string, Record<CropFeature, [number, number]>>;
    metrics: { test_accuracy: number; test_macro_f1: number; cv_accuracy: number };
    best_params: Record<string, number | string | null>;
    feature_importance: Record<CropFeature, number>;
    model_comparison: { Model: string; "CV accuracy": number; "CV macro F1": number }[];
  };
  yield: {
    countries: string[];
    crops: string[];
    year_range: [number, number];
    country_defaults: Record<string, { rainfall: number; pesticides: number; temperature: number }>;
    country_ranges: Record<string, { pesticides: [number, number]; temperature: [number, number] }>;
    ranges: { rainfall: [number, number]; pesticides: [number, number]; temperature: [number, number] };
    kenya_history: Record<string, [number, number][]>;
    metrics: {
      R2: number;
      RMSE: number;
      MAE: number;
      "Kenya RMSE": number;
      "Baseline RMSE": number;
      deployed: { "Test R2": number; "Test RMSE": number; "Kenya RMSE": number };
    };
    best_params: Record<string, number>;
    deploy_params: Record<string, number>;
    feature_importance: Record<string, number>;
    model_comparison: { Model: string; "Validation R2": number; "Validation RMSE (t/ha)": number }[];
  };
};

export const meta = raw as unknown as Metadata;

export const FEATURE_INFO: Record<CropFeature, { label: string; unit: string; step: number; hint: string }> = {
  N: { label: "Nitrogen (N)", unit: "kg/ha", step: 1, hint: "Leaf growth; from manure, CAN, urea" },
  P: { label: "Phosphorus (P)", unit: "kg/ha", step: 1, hint: "Roots and flowering; from DAP, rock phosphate" },
  K: { label: "Potassium (K)", unit: "kg/ha", step: 1, hint: "Fruit quality and drought tolerance" },
  temperature: { label: "Temperature", unit: "°C", step: 0.1, hint: "Average during the growing season" },
  humidity: { label: "Humidity", unit: "%", step: 1, hint: "Average relative humidity" },
  ph: { label: "Soil pH", unit: "", step: 0.1, hint: "Below 5.5 is acidic; consider liming" },
  rainfall: { label: "Rainfall", unit: "mm", step: 1, hint: "Rainfall during the growing season" },
};

const CROP_NAMES: Record<string, { name: string }> = {
  apple: { name: "Apple" },
  banana: { name: "Banana" },
  blackgram: { name: "Black gram" },
  chickpea: { name: "Chickpea" },
  coconut: { name: "Coconut" },
  coffee: { name: "Coffee" },
  cotton: { name: "Cotton" },
  grapes: { name: "Grapes" },
  jute: { name: "Jute" },
  kidneybeans: { name: "Kidney beans" },
  lentil: { name: "Lentil" },
  maize: { name: "Maize" },
  mango: { name: "Mango" },
  mothbeans: { name: "Moth beans" },
  mungbean: { name: "Green grams" },
  muskmelon: { name: "Muskmelon" },
  orange: { name: "Orange" },
  papaya: { name: "Papaya" },
  pigeonpeas: { name: "Pigeon peas" },
  pomegranate: { name: "Pomegranate" },
  rice: { name: "Rice" },
  watermelon: { name: "Watermelon" },
};

export const cropName = (c: string) => CROP_NAMES[c]?.name ?? c;

// grain crops are sold in 90 kg bags in Kenya
export const BAG_CROPS = new Set(["Maize", "Wheat", "Sorghum", "Rice, paddy", "Soybeans"]);
export const ACRES_PER_HA = 2.4711;
