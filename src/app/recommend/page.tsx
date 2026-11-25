import type { Metadata } from "next";
import { RecommendForm } from "./RecommendForm";

export const metadata: Metadata = { title: "Recommend a crop" };

export default function RecommendPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-leaf-900">What should I plant?</h1>
      <p className="mt-2 max-w-2xl text-leaf-900/70">
        Enter your soil test and climate values, or load an example field. The Random Forest model ranks all 22 crops by
        how well they match, and shows where your field differs from the best crop&apos;s usual conditions.
      </p>
      <RecommendForm />
    </div>
  );
}
