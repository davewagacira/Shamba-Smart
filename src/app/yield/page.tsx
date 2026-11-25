import type { Metadata } from "next";
import { YieldForm } from "./YieldForm";

export const metadata: Metadata = { title: "Predict yield" };

export default function YieldPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-leaf-900">How much will I harvest?</h1>
      <p className="mt-2 max-w-2xl text-leaf-900/70">
        Pick a country and crop. The sliders start at that country&apos;s latest recorded climate; move them to test
        &ldquo;what if&rdquo; scenarios, and the prediction updates in real time.
      </p>
      <YieldForm />
    </div>
  );
}
