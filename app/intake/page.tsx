import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/intake",
  title: "Join the November intake: AIC founding cohort",
  description: "The founding cohort of organisations assessed against the AIC standard starts in November. What joining includes, what AIC will and will not do, and how to apply.",
  cardTitle: "Join the November intake",
  cardKicker: "AIC founding cohort",
});

/**
 * The call to action across the site, from October 2026.
 *
 * Built as an offer rather than a contact form: what joining gets you, in
 * the order you would use it, then the line AIC will not cross. That line is
 * stated on the offer itself because it is what makes the rest credible: AIC
 * sets up its own tools for you, and never designs the governance it later
 * certifies.
 *
 * No price and no cohort size are stated until they are decided. Both belong
 * here once they are, and only as true numbers.
 */

const INCLUDED: { title: string; text: string }[] = [
  { title: "The platform, set up with you", text: "AIC connects your systems, imports your AI estate and gets your first evidence flowing, so your record starts filling itself rather than waiting on a project plan." },
  { title: "Your AI register and evidence, mapped", text: "Every AI system with its accountable person, and your evidence mapped to POPIA, ISO/IEC 42001 and the other frameworks you choose." },
  { title: "AIC Aware and its badge", text: "Your organisation's self-assessment and a badge you can show while the audit is under way, labelled for what it is." },
  { title: "Your assessment, first", text: "Founding-cohort organisations are assessed against the AIC standard before anyone else, and appear on the public register when certified." },
  { title: "A trust page and your insurer extract", text: "A public page for customers that reads from your live record, and an extract your insurer can read with a key you control." },
];

export default function IntakePage() {
  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-10 items-end">
          <div className="max-w-2xl">
            <p className="text-sm text-white/60 mb-4">Founding cohort</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>
              Join the November intake
            </h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              The first organisations to be assessed against the AIC standard start together in
              November. You come out of it able to show anyone who asks, whether a client, an
              insurer, your board or the Information Regulator, that a named person answers for
              each of your AI decisions.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-6">
            <p className="text-sm text-white/70 leading-[1.6]">
              Places are limited, because every organisation in the cohort is assessed by AIC&apos;s
              own team.
            </p>
            <Link
              href="/contact?topic=intake"
              className="mt-5 flex items-center justify-center rounded-lg bg-[#c9920a] px-5 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors"
            >
              Apply for a place
            </Link>
            <Link href="/aware" className="mt-3 block text-center text-sm text-white/70 hover:text-white underline underline-offset-4">
              Not sure yet? Take AIC Aware free
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
        <div>
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>What joining includes</h2>
          <p className="text-[#5e6b7b] leading-[1.65] mt-3">In the order you would use it.</p>
        </div>
        <ol className="bg-white border border-[#dde2e8] rounded-xl divide-y divide-[#dde2e8]">
          {INCLUDED.map((x, i) => (
            <li key={x.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 px-5 md:px-6 py-5">
              <span className="text-[#8a6114] font-semibold text-lg tabular-nums">{i + 1}</span>
              <span>
                <span className="block font-semibold">{x.title}</span>
                <span className="block text-[15px] text-[#5e6b7b] leading-[1.6] mt-1">{x.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>The line AIC will not cross</h2>
          <div className="text-[#2b3a4d] leading-[1.75] max-w-[66ch] space-y-4">
            <p>
              AIC sets up its own tools for you. It never writes your policies or designs your
              oversight, because a certification body that designs what it later certifies is
              marking its own work. Your governance is yours; the audit tests it.
            </p>
            <p>
              Joining the intake does not make certification easier or more likely. Founding-cohort
              organisations are assessed against the same 44 requirements as everyone after them,
              and are certified by a body that is not yet accredited, which they should weigh. Their
              audits are also the evidence AIC&apos;s accreditation is built on.{" "}
              <Link href="/disclosures#accreditation" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">
                Read the accreditation status
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid md:grid-cols-[minmax(0,1fr)_auto] gap-6 items-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Who it is for</h2>
          <p className="text-[#5e6b7b] leading-[1.7] mt-3">
            Organisations that use AI, or automated scoring, in decisions that affect people: credit,
            insurance, hiring, healthcare, collections, pricing. If POPIA section 71 applies to you,
            the record you build here is how you show who answers for each automated decision.
          </p>
        </div>
        <Link
          href="/contact?topic=intake"
          className="inline-flex items-center justify-center rounded-lg bg-[#0e1b2c] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#1a3160] transition-colors"
        >
          Apply for a place
        </Link>
      </section>
    </div>
  );
}
