"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";

const CODE_RE = /^AWR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

// Badge-code lookup for the AIC Aware section of the registry.
export default function AwareLookup() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [bad, setBad] = useState(false);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase().replace(/[IL]/g, "1").replace(/O/g, "0");
    if (!CODE_RE.test(c)) return setBad(true);
    router.push(`/registry/aware/${c}`);
  }

  return (
    <section className="py-16 bg-white border-t border-[#e5e7eb]">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-5 h-5 text-aic-copper" />
          <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">AIC Aware</span>
        </div>
        <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mb-3 font-bold" style={{ fontFamily: "'Merriweather', serif" }}>
          Check an AIC Aware badge
        </h2>
        <p className="text-[#6b7280] leading-relaxed max-w-2xl mb-6">
          AIC Aware is a self-declaration made by a registered organisation and its named accountable person — not
          certification. Every badge carries a code and links to its entry here, so you can see whether it is current.
        </p>
        <form onSubmit={go} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setBad(false); }}
            placeholder="AWR-XXXX-XXXX"
            aria-label="AIC Aware badge code"
            className="flex-1 h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-aic-copper/30"
          />
          <button className="h-12 px-6 rounded-xl bg-[#0f1f3d] text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#0a1628]">
            Check <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {bad && <p className="mt-2 text-sm text-[#c41e3a]">Badge codes look like AWR-7K2M-9XQ4.</p>}
        <Link href="/registry/aware" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aic-copper hover:gap-2.5 transition-all">
          Browse listed AIC Aware organisations <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
