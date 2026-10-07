import Link from "next/link";
import type { CountryRegulation } from "@/app/data/regulatory-data";
import { frameworks } from "@/app/data/frameworks-data";
import { trackedFor, industryNote, type IndustrySlug, type TrackedFramework } from "@/app/data/jurisdiction-frameworks";
import { RecordHeading } from "@/app/components/RecordHeading";

/**
 * Every framework AIC offers, as it meets one jurisdiction.
 *
 * The map used to tie a country only to AIC certification. AIC offers three
 * different things, and a reader in a given country needs all three in view,
 * kept apart because they promise different things: frameworks the platform
 * tracks evidence against, the industry frameworks on /frameworks, and the
 * certification standard. See app/data/jurisdiction-frameworks.ts.
 */
export default function JurisdictionFrameworks({ j }: { j: CountryRegulation }) {
  const t = trackedFor(j.id);

  return (
    <div>
      <RecordHeading
        id="aic-frameworks"
        lede={<>AIC offers three kinds of framework, and they promise different things. Tracking one in the platform maps your evidence to it. An industry framework maps AI onto a safety discipline your sector already uses. Certification is the independent audit.</>}
      >
        Every AIC framework that applies in {j.name}
      </RecordHeading>

      <div className="border-y border-[#dde2e8] divide-y divide-[#dde2e8]">
        {/* 1. Tracked in the platform */}
        <section className="grid md:grid-cols-[11rem_minmax(0,1fr)] gap-3 md:gap-8 py-6" aria-labelledby="fw-tracked">
          <div>
            <h3 id="fw-tracked" className="font-semibold text-[#0f1f3d] leading-snug">Track in the platform</h3>
            <p className="text-sm text-[#5e6b7b] mt-1">Evidence from your connected systems, mapped to each requirement</p>
          </div>
          <div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <FrameworkList
                title={`${j.name}’s own`}
                items={t.home}
                empty={`The platform does not track a framework specific to ${j.name} yet. The international ones apply.`}
              />
              <FrameworkList title="Wherever you operate" items={t.international} />
            </div>
            {t.note && <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-4">{t.note}</p>}
            <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-4">
              A mapping says this evidence usually supports this requirement. It is not an
              auditor&apos;s conclusion, and tracking a framework has no bearing on AIC certification.{" "}
              <Link href="/platform#compliance" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">
                See everything the platform tracks
              </Link>
            </p>
          </div>
        </section>

        {/* 2. Industry frameworks */}
        <section className="grid md:grid-cols-[11rem_minmax(0,1fr)] gap-3 md:gap-8 py-6" aria-labelledby="fw-industry">
          <div>
            <h3 id="fw-industry" className="font-semibold text-[#0f1f3d] leading-snug">Industry frameworks</h3>
            <p className="text-sm text-[#5e6b7b] mt-1">AI mapped onto the safety discipline your sector already runs on</p>
          </div>
          <ul className="space-y-5">
            {frameworks.map((f) => (
              <li key={f.slug}>
                <Link href={`/frameworks/${f.slug}`} className="font-semibold text-[#0f1f3d] hover:text-[#8a6114] transition-colors">
                  {f.industry}
                </Link>
                <span className="text-sm text-[#5e6b7b]">, against {f.standardName}</span>
                <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-1 max-w-[62ch]">
                  {industryNote(f.slug as IndustrySlug, j.id, j.name)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Certification */}
        <section className="grid md:grid-cols-[11rem_minmax(0,1fr)] gap-3 md:gap-8 py-6" aria-labelledby="fw-cert">
          <div>
            <h3 id="fw-cert" className="font-semibold text-[#0f1f3d] leading-snug">AIC certification</h3>
            <p className="text-sm text-[#5e6b7b] mt-1">The independent audit</p>
          </div>
          <div className="text-sm text-[#5e6b7b] leading-[1.65] max-w-[62ch]">
            <p>
              The standard is the same in {j.name} as everywhere else. What changes is how much of
              it applies, which depends on how much human judgement sits between your AI and its
              decisions.{" "}
              <a href="#aic-standard" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">
                See what it would ask of you
              </a>
            </p>
            {j.detail?.coverage?.some(Boolean) && (() => {
              const n = j.detail.coverage.filter(Boolean).length;
              const total = j.detail.obligations.length;
              return (
                <p className="mt-2">
                  {n === total ? `All ${total} duties above meet` : `${n} of the ${total} duties above meet`} one or
                  more of its requirements.
                </p>
              );
            })()}
          </div>
        </section>
      </div>
    </div>
  );
}

function FrameworkList({ title, items, empty }: { title: string; items: TrackedFramework[]; empty?: string }) {
  return (
    <div>
      <h4 className="text-[13px] font-medium text-[#5e6b7b] mb-2">{title}</h4>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((f) => (
            <li key={f.key} className="leading-snug">
              <span className="block font-medium text-[#0f1f3d]">{f.name}</span>
              <span className="block text-[13px] text-[#5e6b7b]">{f.publisher}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#5e6b7b] leading-[1.6]">{empty}</p>
      )}
    </div>
  );
}
