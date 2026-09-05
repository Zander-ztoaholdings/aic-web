import type { Metadata } from "next";
import AwareClient from "./AwareClient";

export const metadata: Metadata = {
  title: "AIC Aware — Free Self-Declared AI Integrity Assessment",
  description:
    "A free, rigorous self-assessment against the same governance questions AIC audits against. Self-declared, not verified — the free companion to AIC Certified.",
};

export default function AwarePage() {
  return <AwareClient />;
}
