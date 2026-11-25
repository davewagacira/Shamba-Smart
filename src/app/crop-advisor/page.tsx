import type { Metadata } from "next";
import { RecommendForm } from "./RecommendForm";

export const metadata: Metadata = {
  title: "Crop Advisor",
  description: "Find the crops best suited to your soil and climate, and what to fix in your soil.",
};

export default function CropAdvisorPage() {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">Crop Advisor</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-leaf-900">What should I plant?</h1>
      <p className="mt-2 max-w-2xl text-leaf-900/70">
        Enter the values from your soil test and your local climate, or start from a typical field. We rank 22 crops
        by how well they suit your land and show what to adjust.
      </p>
      <RecommendForm />
    </div>
  );
}
