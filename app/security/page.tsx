"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

/**
 * Security at AIC: what is actually in place, stated plainly enough that a
 * client's security lead or an insurer can check it. Every statement here
 * must stay true; if a control changes, this page changes with it.
 */

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Your data in transit and at rest",
    items: [
      "Every connection to aiccertified.cloud and app.aiccertified.cloud is encrypted (HTTPS), and browsers are told never to connect without it.",
      "Secrets AIC must keep, such as a provider key you choose to give us or a second-factor secret, are encrypted individually with AES-256-GCM under keys that can be rotated.",
      "Passwords are stored only as bcrypt hashes. Nobody at AIC can read your password.",
      "Evidence files are fingerprinted (SHA-256) when you upload them, and the fingerprint is checked every time an assessor opens one.",
    ],
  },
  {
    title: "Keeping organisations apart",
    items: [
      "Every query for an organisation's data is scoped to that organisation in the application, and the database enforces the same separation with row-level security on a restricted database account.",
      "Your continuity record is hash-chained: each entry includes a fingerprint of the one before it, so an edit or deletion anywhere in the record is detectable.",
    ],
  },
  {
    title: "Who at AIC can see what",
    items: [
      "Access inside AIC is by role. Assessors see the organisations they assess; administration of accounts is limited to a small number of named people.",
      "Every administrative change (a role change, a suspended account, an evidence decision) requires a written reason and is recorded with who made it and when.",
      "Client accounts require a second factor at sign-in.",
    ],
  },
  {
    title: "Connected systems",
    items: [
      "GitHub is read through an AIC app you install on the repositories you choose. Every permission it requests is read-only, and you can uninstall it at any time.",
      "AI-provider usage reaches AIC either through an exporter you run, so AIC never sees your provider key, or through a read-only key you choose to give us, which is encrypted and deleted when you disconnect.",
      "AIC never reads prompts, model outputs, source code or your customers' data from a connected system.",
    ],
  },
  {
    title: "Backups and continuity",
    items: [
      "The database and evidence store are backed up every night, encrypted, to storage separate from the servers that run the platform. The key that decrypts them is not kept on those servers.",
      "Restoring from backup is tested regularly, not assumed.",
    ],
  },
  {
    title: "If something goes wrong",
    items: [
      "If personal information in our care is accessed without authorisation, we will tell the affected organisations and the Information Regulator as soon as reasonably possible, as section 22 of POPIA requires, and say what happened and what we are doing about it.",
      "Code changes are reviewed and tested automatically before they reach production, and dependencies are monitored for known vulnerabilities.",
    ],
  },
];

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
            <a href="mailto:security@aiccertified.cloud" className="text-aic-copper hover:underline">security@aiccertified.cloud</a>{" "}
            with what you found and how to reproduce it. We acknowledge reports within two working days and will not take action against
            anyone who reports in good faith, avoids other people&apos;s data, and gives us reasonable time to fix the issue.
          </p>
        </div>
      </section>
    </div>
  );
}
