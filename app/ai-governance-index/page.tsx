import Link from "next/link";
import { BarChart3, ArrowRight, ShieldCheck } from "lucide-react";

// The AI Governance Index is the scoring instrument, deliberately separate from
// the certification register (PRD D6, §8.2): the register carries status bands
// and never a number, precisely so that scoring lives here instead.
//
// The previous version of this page did not respect that separation. It called
// itself "the public register of organisations that hold AIC certification" —
// the register's job — while also rendering an "Integrity Score" column. Empty,
// that was a duplicate of /registry competing for the same search intent. With
// data in it, it would have been a register publishing scores: a live D6 breach.
//
// So this page now states what the Index is, says plainly that it has not been
// published, and points certification lookups at the register where they belong.
// The original layout is preserved in the vault under 9 - Drafts.

export default function AIGovernanceIndexPage() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <section className="bg-aic-navy text-white py-24">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              AI Governance Index
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Not published yet.
          </h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            The Index is intended as AIC&apos;s public measure of organisational AI
            accountability &mdash; a scored, comparative instrument, deliberately separate from
            the certification register. It does not exist yet, and we would rather say so than
            show a page of placeholder rankings.
          </p>
        </div>
      </section>

      <section className="py-20 border-b border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            Why it is separate
          </span>
          <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mt-4 mb-6 font-bold tracking-[-0.02em]">
            Certification is a status. An index is a score.
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed mb-6">
            The certification register never shows a numeric score. Scores invite ranking
            pressure and gaming, and certification status is deliberately closer to binary: an
            organisation either meets the requirements or it does not. Keeping a scored index
            apart from the register is what stops one contaminating the other.
          </p>
          <p className="text-[#6b7280] text-lg leading-relaxed">
            That separation only holds if we respect it before there is any data to publish,
            which is why this page says nothing rather than borrowing the register&apos;s
            language.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-[#0f1f3d] mb-4">
            Looking to check a certification?
          </h2>
          <p className="text-[#6b7280] leading-relaxed mb-8">
            Certification status is published on the register, and any certificate ID can be
            confirmed directly with us.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/registry"
              className="inline-flex items-center gap-2 bg-aic-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Public registry
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 border border-[#e5e7eb] text-[#0f1f3d] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#f0f4f8] transition-all"
            >
              Verify a certificate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
