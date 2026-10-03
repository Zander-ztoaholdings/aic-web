import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIC Aware badge rules — AIC",
  description: "Where and how an AIC Aware badge may be used, what it does and does not mean, and when AIC revokes one.",
  alternates: { canonical: "/aware/badge-rules" },
};

// DRAFT for Zander's review. These are the rules the submission declaration
// refers to; changing their meaning after badges are issued needs notice to
// badge holders.

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-12 mb-3 text-xl font-semibold tracking-tight text-[#0f1f3d]">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 leading-relaxed text-[#4b5563]">{children}</p>
);
const L = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="mb-4 space-y-2 pl-5 list-disc marker:text-[#c9920a] text-[#4b5563] leading-relaxed">
    {items.map((x, i) => <li key={i}>{x}</li>)}
  </ul>
);

export default function BadgeRulesPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-aic-copper">AIC Aware</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0f1f3d]">Badge rules</h1>
        <p className="mt-3 text-[#6b7280]">Version 2026-10. These rules form part of the declaration every organisation confirms when its badge is issued.</p>

        <H>What the badge means</H>
        <P>
          An AIC Aware badge shows that a registered organisation has declared, through a named and accountable person, how it uses AI in
          decisions that affect people. It is a <strong className="text-[#0f1f3d]">self-declaration</strong>. It is not AIC certification,
          it is not an independent audit, and it does not mean AIC has checked, approved or endorsed any AI system or product.
        </P>

        <H>Where you may use it</H>
        <P>While the badge is valid, the organisation it was issued to may show it on:</P>
        <L items={[
          "its own website",
          "its staff's email signatures",
          "proposals, tenders and supplier questionnaires",
          "presentations, annual reports and ESG or sustainability reports",
        ]} />

        <H>How to use it</H>
        <L items={[
          <>Online, always link the badge to its entry in the <Link href="/registry/aware" className="text-aic-copper underline underline-offset-2">AIC Public Registry</Link>. The embed code from your AIC account does this for you.</>,
          "Offline, where a link is not possible, show the badge with its code visible so a reader can check it at aiccertified.cloud/registry.",
          "Use the badge as issued. Do not change its wording, colours or proportions, crop it, or combine it with other marks in a way that suggests it is a certification.",
          "Refer to it as “AIC Aware” or “AIC Aware (self-declared)”.",
        ]} />

        <H>Where you may not use it</H>
        <L items={[
          "on products, packaging or product documentation, or in any way that suggests a particular AI system or product has been certified or approved",
          "in any wording such as “AIC certified”, “AIC approved” or “endorsed by AIC”",
          "after it has expired or been revoked",
          "by any organisation other than the one it was issued to, including parent companies, subsidiaries and partners, which need their own",
        ]} />

        <H>Keeping it valid</H>
        <L items={[
          "A badge is valid for twelve months from issue. Renew it by completing AIC Aware again in your account before it expires.",
          "If your accountable person leaves or changes role, name the new person in your account within 30 days.",
          "If the way you use AI changes materially, for example a new system that makes decisions about people, complete AIC Aware again so the declaration stays true.",
        ]} />

        <H>Revocation</H>
        <P>AIC may revoke a badge if:</P>
        <L items={[
          "the declaration is found to be untrue or misleading",
          "the badge is used outside these rules and the use is not corrected within 14 days of AIC asking",
          "the organisation has no current accountable person",
          "the organisation asks for it to be withdrawn",
        ]} />
        <P>
          A revoked badge shows as revoked, with the reason, on its registry entry and on every site that embeds it. The organisation must
          remove it from anything it controls within 14 days. To dispute a revocation, write to us within 30 days; someone who was not
          involved in the decision will review it.
        </P>

        <H>Reporting misuse</H>
        <P>
          If you see an AIC Aware badge that does not link to a valid registry entry, or is used in a way these rules do not allow, please{" "}
          <Link href="/contact" className="text-aic-copper underline underline-offset-2">tell us</Link>.
        </P>
      </div>
    </div>
  );
}
