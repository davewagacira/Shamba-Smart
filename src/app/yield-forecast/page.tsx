import type { Metadata } from "next";
import { ToolSwitcher } from "@/components/ToolSwitcher";
import { YieldForm } from "./YieldForm";

export const metadata: Metadata = {
  title: "Yield Forecast",
  description: "Forecast the expected harvest per hectare, per acre and in 90 kg bags.",
};

export default function YieldForecastPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      <ToolSwitcher />
      <h1 className="text-3xl font-semibold tracking-tight text-leaf-900">How much will I harvest?</h1>
      <p className="mt-2 max-w-2xl text-leaf-900/70">
        Choose your country and crop. Conditions start at the latest recorded values; adjust them to explore
        different scenarios, and the forecast updates instantly.
      </p>
      <YieldForm />
    </div>
  );
}
