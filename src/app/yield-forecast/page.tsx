import type { Metadata } from "next";
import { YieldForm } from "./YieldForm";

export const metadata: Metadata = {
  title: "Yield Forecast",
  description: "Forecast the expected harvest per hectare, per acre and in 90 kg bags.",
};

export default function YieldForecastPage() {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wider text-soil-700">Yield Forecast</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-leaf-900">How much will I harvest?</h1>
      <p className="mt-2 max-w-2xl text-leaf-900/70">
        Choose your country and crop. Conditions start at the latest recorded values; adjust them to explore
        different scenarios, and the forecast updates instantly.
      </p>
      <YieldForm />
    </div>
  );
}
