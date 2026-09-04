"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { QrCode, Search, ArrowRight } from "lucide-react";

export default function VerifyIndexPage() {
  const [certId, setCertId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certId.trim();
    if (trimmed) router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
                Proof Layer
              </span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic" style={{ fontFamily: "'Merriweather', serif" }}>
              Verify a Certificate
            </h1>
            <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
              Every AIC badge links to this page. Enter the certificate ID printed on a badge, or scan
              its QR code, to confirm what it does — and doesn&apos;t — claim.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-b border-[#e5e7eb]">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <input
              type="text"
              placeholder="e.g. AIC-XXXXXXXX-2026"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full pl-12 pr-32 h-14 bg-white border border-[#e5e7eb] rounded-xl text-lg font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-aic-copper/30"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-aic-copper text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#b07d08] transition-all inline-flex items-center gap-2"
            >
              Verify <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-sm text-[#6b7280] mt-6 leading-relaxed">
            This confirms a certificate&apos;s status directly from AIC&apos;s records — never from the
            organisation presenting it. If an organisation cites AIC certification without a
            certificate ID you can verify here, that claim cannot be confirmed.
          </p>
        </div>
      </section>
    </div>
  );
}
