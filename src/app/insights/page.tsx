import type { Metadata } from "next";
import { Bars } from "@/components/Bars";
import { FEATURE_INFO, meta, type CropFeature } from "@/lib/meta";

export const metadata: Metadata = { title: "Model insights" };

const C = meta.crop, Y = meta.yield;
const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const kenya = Object.entries(Y.kenya_history)
  .map(([crop, pts]) => ({ label: crop, value: median(pts.map((p) => p[1])) }))
  .sort((a, b) => b.value - a.value);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-leaf-900">{title}</h2>
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-leaf-50 p-4">
      <p className="text-2xl font-semibold text-leaf-700 tabular-nums">{value}</p>
      <p className="text-xs text-leaf-900/60">{label}</p>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-leaf-900">Model insights</h1>
        <p className="mt-2 max-w-2xl text-leaf-900/70">
          How the two models were chosen and how well they perform on data they never saw during training.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Crop recommendation: Random Forest classifier">
          <div className="grid grid-cols-3 gap-3">
            <Stat value={`${(C.metrics.test_accuracy * 100).toFixed(2)}%`} label="test accuracy (440 fields)" />
            <Stat value={C.metrics.test_macro_f1.toFixed(3)} label="macro F1" />
            <Stat value={`${(C.metrics.cv_accuracy * 100).toFixed(2)}%`} label="5-fold CV accuracy" />
          </div>
          <h3 className="mt-6 mb-2 text-sm font-medium text-leaf-900/70">Models compared (5-fold cross-validation accuracy)</h3>
          <Bars items={C.model_comparison.map((m) => ({ label: m.Model, value: m["CV accuracy"] }))} max={1}
            format={(v) => `${(v * 100).toFixed(1)}%`} />
          <h3 className="mt-6 mb-2 text-sm font-medium text-leaf-900/70">What the model looks at most</h3>
          <Bars items={(Object.entries(C.feature_importance) as [CropFeature, number][]).map(([f, v]) => ({ label: FEATURE_INFO[f].label, value: v }))}
            color="bg-sun-400" />
        </Card>

        <Card title="Yield prediction: Random Forest regressor">
          <div className="grid grid-cols-3 gap-3">
            <Stat value={Y.metrics.deployed["Test R2"].toFixed(3)} label="R² on 2009–2013" />
            <Stat value={`${Y.metrics.deployed["Test RMSE"].toFixed(2)}`} label="RMSE t/ha (baseline 8.83)" />
            <Stat value={`${Y.metrics.deployed["Kenya RMSE"].toFixed(2)}`} label="RMSE t/ha, Kenya only" />
          </div>
          <h3 className="mt-6 mb-2 text-sm font-medium text-leaf-900/70">Models compared (R² on validation years 2005–2008)</h3>
          <Bars items={Y.model_comparison.filter((m) => m["Validation R2"] > 0).map((m) => ({ label: m.Model, value: m["Validation R2"] })).sort((a, b) => b.value - a.value)}
            max={1} format={(v) => v.toFixed(3)} />
          <h3 className="mt-6 mb-2 text-sm font-medium text-leaf-900/70">What drives the predicted yield</h3>
          <Bars items={Object.entries(Y.feature_importance).map(([f, v]) => ({ label: f, value: v }))} color="bg-soil-500" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Typical Kenyan yields, 1990–2013 (median t/ha)">
          <Bars items={kenya} color="bg-leaf-600" format={(v) => v.toFixed(1)} />
          <p className="mt-4 text-sm text-leaf-900/60">
            Root and tuber crops produce far more tonnes per hectare than grains, which is why the crop type is the
            strongest driver in the yield model.
          </p>
        </Card>
        <Card title="How we trained and tested">
          <ul className="space-y-3 text-sm text-leaf-900/80">
            <li><b>Crop model:</b> 80:20 stratified split; six algorithms compared with 5-fold cross-validation; Random Forest tuned with GridSearchCV (best: {Object.entries(C.best_params).map(([k, v]) => `${k}=${v}`).join(", ")}).</li>
            <li><b>Yield model:</b> split by time (train 1990–2004, validate 2005–2008, test 2009–2013) because farmers need forecasts for future seasons. 3,837 duplicated country-crop-year rows were merged first.</li>
            <li><b>A data finding:</b> rainfall in the FAO data is one fixed long-term average per country (Kenya: 630 mm every year). The model therefore cannot learn how a wet or dry season changes yield, so the app does not offer rainfall as a what-if.</li>
            <li><b>Deployment:</b> the tuned forest ({Y.best_params.n_estimators} trees) is ~50 MB as ONNX. A compact forest ({Y.deploy_params.n_estimators} trees, min {Y.deploy_params.min_samples_leaf} samples per leaf) is 7× smaller and only 0.05 t/ha less accurate, so the app uses it.</li>
            <li><b>Serving:</b> both models are exported to ONNX and run with onnxruntime-node inside Next.js route handlers. ONNX and scikit-learn predictions match (100% agreement, max difference 0.00001 t/ha).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
