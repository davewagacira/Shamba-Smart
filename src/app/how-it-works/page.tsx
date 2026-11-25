import type { Metadata } from "next";
import { Bars } from "@/components/Bars";
import { FEATURE_INFO, meta, type CropFeature } from "@/lib/meta";

export const metadata: Metadata = {
  title: "How it works",
  description: "The data behind ShambaSmart, how accurate it is, and its limitations.",
};

const C = meta.crop, Y = meta.yield;
const testFields = 440;
const correct = Math.round(C.metrics.test_accuracy * testFields);
const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const kenya = Object.entries(Y.kenya_history)
  .map(([crop, pts]) => ({ label: crop, value: median(pts.map((p) => p[1])) }))
  .sort((a, b) => b.value - a.value);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-leaf-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-leaf-900">{title}</h2>
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-leaf-50 p-3 sm:p-4">
      <p className="whitespace-nowrap text-lg font-semibold text-leaf-700 tabular-nums sm:text-2xl">{value}</p>
      <p className="text-xs text-leaf-900/60">{label}</p>
    </div>
  );
}

const Sub = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 mt-6 text-sm font-medium text-leaf-900/70">{children}</h3>
);

export default function HowItWorksPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">How it works</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-leaf-900">Built on real data, tested on fields it has never seen</h1>
        <p className="mt-2 max-w-2xl text-leaf-900/70">
          ShambaSmart uses two machine learning models: one learned from thousands of soil and climate measurements,
          the other from 24 years of national harvest records. Each was checked against data held back from training,
          so the accuracy below reflects new fields and new seasons.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Crop Advisor">
          <div className="grid grid-cols-3 gap-3">
            <Stat value={`${correct}/${testFields}`} label="test fields matched to the right crop" />
            <Stat value={`${C.classes.length}`} label="crops covered" />
            <Stat value="7" label="soil and climate factors" />
          </div>
          <Sub>What matters most when choosing a crop</Sub>
          <Bars items={(Object.entries(C.feature_importance) as [CropFeature, number][]).map(([f, v]) => ({ label: FEATURE_INFO[f].label, value: v }))}
            color="bg-sun-400" format={(v) => `${Math.round(v * 100)}%`} />
          <p className="mt-4 text-sm text-leaf-900/60">
            Water conditions (rainfall and humidity) separate crops more than soil chemistry does. The only mistakes
            in testing were between rice and jute, which grow in similar hot, wet conditions.
          </p>
        </Card>

        <Card title="Yield Forecast">
          <div className="grid grid-cols-3 gap-3">
            <Stat value={`±${Y.metrics.MAE.toFixed(1)}`} label="t/ha typical margin on 2009–2013 harvests" />
            <Stat value={`${Math.round(Y.metrics.deployed["Test R2"] * 100)}%`} label="of harvest differences explained" />
            <Stat value={`${Y.countries.length}`} label="countries, Kenya included" />
          </div>
          <Sub>What drives the expected harvest</Sub>
          <Bars items={Object.entries(Y.feature_importance).map(([f, v]) => ({ label: f, value: v }))}
            color="bg-soil-500" format={(v) => `${Math.round(v * 100)}%`} />
          <p className="mt-4 text-sm text-leaf-900/60">
            The crop itself matters most, followed by the country, which reflects soils and farming practice. Forecasts
            were tested on 2009–2013, years the model never saw, to mirror forecasting a new season.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Typical Kenyan harvests, 1990–2013 (t/ha)">
          <Bars items={kenya} color="bg-leaf-600" format={(v) => v.toFixed(1)} />
          <p className="mt-4 text-sm text-leaf-900/60">Median tonnes per hectare from national FAO records.</p>
        </Card>
        <div className="space-y-6">
          <Card title="Our data">
            <ul className="space-y-2 text-sm text-leaf-900/80">
              <li><b>Soil and climate:</b> 2,200 field measurements across 22 crops (Crop Recommendation dataset).</li>
              <li><b>Harvests:</b> 13,130 national harvest records for 10 crops in 101 countries, 1990–2013, compiled from FAO and World Bank data.</li>
            </ul>
          </Card>
          <Card title="Know the limits">
            <ul className="list-disc space-y-2 pl-5 text-sm text-leaf-900/80">
              <li>Harvest forecasts describe a typical yield for a country, not a specific farm.</li>
              <li>Rainfall is recorded as one long-term average per country, so forecasts cannot reflect an unusually wet or dry season.</li>
              <li>The harvest records end in 2013; later years are forecast like 2013.</li>
              <li>Recommendations are guidance. Confirm major decisions with a local agronomist.</li>
            </ul>
          </Card>
        </div>
      </div>

      <details className="group rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer list-none text-lg font-semibold text-leaf-900">
          Technical details <span className="text-sm font-normal text-leaf-900/50 group-open:hidden">(show)</span>
        </summary>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-semibold text-leaf-900">Crop Advisor: Random Forest classifier</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Stat value={`${(C.metrics.test_accuracy * 100).toFixed(2)}%`} label="test accuracy" />
              <Stat value={C.metrics.test_macro_f1.toFixed(3)} label="macro F1" />
              <Stat value={`${(C.metrics.cv_accuracy * 100).toFixed(2)}%`} label="5-fold CV accuracy" />
            </div>
            <Sub>Algorithms compared (5-fold cross-validation accuracy)</Sub>
            <Bars items={C.model_comparison.map((m) => ({ label: m.Model, value: m["CV accuracy"] }))} max={1}
              format={(v) => `${(v * 100).toFixed(1)}%`} />
            <p className="mt-4 text-sm text-leaf-900/70">
              Stratified 80:20 split; tuned with GridSearchCV (
              {Object.entries(C.best_params).map(([k, v]) => `${k}=${v}`).join(", ")}).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-leaf-900">Yield Forecast: Random Forest regressor</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Stat value={Y.metrics.deployed["Test R2"].toFixed(3)} label="R² (2009–2013)" />
              <Stat value={Y.metrics.deployed["Test RMSE"].toFixed(2)} label={`RMSE t/ha (mean baseline ${Y.metrics["Baseline RMSE"].toFixed(2)})`} />
              <Stat value={Y.metrics.deployed["Kenya RMSE"].toFixed(2)} label="RMSE t/ha, Kenya" />
            </div>
            <Sub>Algorithms compared (R² on validation years 2005–2008)</Sub>
            <Bars items={Y.model_comparison.filter((m) => m["Validation R2"] > 0).map((m) => ({ label: m.Model, value: m["Validation R2"] })).sort((a, b) => b.value - a.value)}
              max={1} format={(v) => v.toFixed(3)} />
            <p className="mt-4 text-sm text-leaf-900/70">
              Time-based split (train 1990–2004, validate 2005–2008, test 2009–2013); 3,837 duplicated country-crop-year
              rows merged. Deployed as a compact forest ({Y.deploy_params.n_estimators} trees, min leaf {Y.deploy_params.min_samples_leaf}),
              7× smaller than the tuned forest for 0.05 t/ha more error.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-leaf-900/70">
          Both models were trained in Python with scikit-learn, exported to ONNX and are served by Next.js route handlers
          with onnxruntime-node. ONNX predictions match scikit-learn exactly (100% label agreement; maximum yield
          difference 0.00001 t/ha).
        </p>
      </details>
    </div>
  );
}
