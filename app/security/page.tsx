"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SECTIONS } from "@/app/data/security";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Security at AIC: what is actually in place, stated plainly enough that a
 * client's security lead or an insurer can check it. Every statement here
 * must stay true; if a control changes, this page changes with it.
 */



export default function SecurityPage() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <section className="bg-aic-navy text-aic-paper py-24 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 relative z-10">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">Institutional Trust</span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic">Security</h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              How AIC protects the records organisations trust it with. Each statement below describes something in place today.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <p className="text-[#6b7280]/60 mb-12 italic font-mono text-sm uppercase tracking-widest">Last Updated: October 2026</p>
          {SECTIONS.map((s, i) => (
            <div key={s.title}>
              <h2 className={`text-aic-navy font-serif italic text-3xl mb-4 ${i === 0 ? "" : "mt-16"}`}>{i + 1}. {s.title}</h2>
              <div className="space-y-3 mb-8">
                {s.items.map((item) => (
                  <div key={item} className="flex gap-3 items-start py-2 border-b border-[#e5e7eb] last:border-0">
                    <ShieldCheck className="w-4 h-4 text-aic-copper shrink-0 mt-1" />
                    <p className="text-[#6b7280] text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">{SECTIONS.length + 1}. Reporting a vulnerability</h2>
          <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
            If you believe you have found a security issue, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Security%20report`} className="text-aic-copper hover:underline">{CONTACT_EMAIL}</a>{" "}
            with &ldquo;Security report&rdquo; in the subject, what you found and how to reproduce it. We acknowledge reports within two working days and will not take action against
            anyone who reports in good faith, avoids other people&apos;s data, and gives us reasonable time to fix the issue.
          </p>
        </div>
      </section>
    </div>
  );
}
