'use client';
import { CONTACT_EMAIL } from "@/lib/contact";
import Link from "next/link";
import { SAFEGUARDS } from "@/app/data/impartiality";

import React, { useEffect, useRef, useState } from "react";
import { scrollElementToTop } from "@/lib/scroll";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Scale,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

// Derived from the newest dated item on the page, so the header cannot drift
// out of step with the content the way a hand-typed date does. It read
// "February 1, 2026" while sitting above the accreditation status rewritten in
// September.
const LAST_UPDATED = "20 October 2026";

const appealCases: { caseId: string; organization: string; dateSubmitted: string; status: string; issue: string }[] = [];

export default function DisclosuresPage() {
  const [activeTab, setActiveTab] = useState("impartiality");

  // These tabs are controlled state, so a link to /disclosures#accreditation
  // would otherwise land on the page showing the impartiality tab instead.
  // The accreditation status is linked to from the mark in the header and
  // footer, and from elsewhere on the site, so the deep link has to work.
  const TAB_IDS = ["impartiality", "accreditation", "directory", "appeals"];
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!TAB_IDS.includes(hash)) return;
      setActiveTab(hash);
      // Selecting the tab was not enough: there is no element with that id on
      // the page, so the browser had nothing to scroll to and left the reader
      // at the very top, above a full-height hero, with the right tab open
      // somewhere below the fold. The navbar and footer marks both link here.
      requestAnimationFrame(() => scrollElementToTop(tabsRef.current));
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* The stock photograph of a hand signing a document was doing nothing
            except loading a third-party image on the page a regulator reads. */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 to-[#0a1628]/80" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#c9920a]" />
              <span className="text-[#c9920a] text-sm font-medium">
                Governance and disclosures
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
              Public Disclosures &<br />
              <span className="text-[#c9920a]">Compliance</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              AIC maintains full transparency regarding our methodology, impartiality, certified organizations, and appeals processes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-aic-paper border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              // Each tile states something the tabs below support. "Methodology:
              // Assessed" and "Recognition: Global" sat above an accreditation
              // tab that opens with "AIC is not yet accredited".
              { icon: Shield, label: "Accreditation", value: "Not yet" },
              { icon: Building2, label: "Certificates issued", value: "None yet" },
              { icon: FileText, label: "The standard", value: "Published in full" },
              { icon: Scale, label: "Impartiality statement", value: "Version 2.0" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-[#c9920a] mx-auto mb-2" />
                  <div className="text-sm text-[#6b7280]/80 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-[#0f1f3d]">{item.value}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div ref={tabsRef} className="scroll-mt-32">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* The four tabs measured 597px on a 390px phone and pushed the
                whole page sideways. They now wrap into a 2 x 2 grid there. */}
            <TabsList className="mb-8 grid grid-cols-2 sm:inline-flex h-auto w-full sm:w-fit gap-1">
              <TabsTrigger value="impartiality" className="whitespace-normal sm:whitespace-nowrap py-2 sm:px-3">Impartiality</TabsTrigger>
              <TabsTrigger value="accreditation" className="whitespace-normal sm:whitespace-nowrap py-2 sm:px-3">Accreditation status</TabsTrigger>
              <TabsTrigger value="directory" className="whitespace-normal sm:whitespace-nowrap py-2 sm:px-3">Public register</TabsTrigger>
              <TabsTrigger value="appeals" className="whitespace-normal sm:whitespace-nowrap py-2 sm:px-3">Appeals</TabsTrigger>
            </TabsList>

            {/* Impartiality Statement */}
            <TabsContent value="impartiality">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0a1628] rounded-lg flex items-center justify-center shrink-0">
                      <Scale className="w-6 h-6 text-[#c9920a]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-[#0f1f3d] mb-2">
                        Statement of Impartiality and Independence
                      </h2>
                      <p className="text-sm text-[#6b7280]/80">
                          Last updated: {LAST_UPDATED}
                        </p>
                    </div>
                  </div>

                  <div className="space-y-6 text-[#0f1f3d] leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Core Principle</h3>
                      <p>
                        AI Integrity Certification (Pty) Ltd (AIC) operates as an independent, third-party certification body. We maintain strict impartiality in all certification activities and do not provide consultancy services to organizations seeking certification.
                      </p>
                    </div>

                    <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#c9920a] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-[#0f1f3d] mb-2">Conflicts of Interest</h4>
                          <p className="text-sm text-[#6b7280]">
                            AIC does <strong>not</strong> provide any of the following services to organizations it
                            certifies:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-[#6b7280] list-disc list-inside">
                            <li>Management system implementation consulting</li>
                            <li>Internal audit services</li>
                            <li>Risk assessment design or execution</li>
                            <li>Policy or procedure development</li>
                            <li>Training that designs, reviews or implements an organisation&apos;s controls</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Independence Safeguards</h3>
                      <p className="text-sm text-[#6b7280] mb-4">
                        Each safeguard below is marked with what it actually is
                        today. A commitment we have made and a mechanism that is
                        already running are different things, and a certification
                        body that blurs them has no business grading anyone else.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {SAFEGUARDS.map((safeguard, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-aic-paper rounded-lg border border-[#e5e7eb]">
                            {safeguard.state === "in force" ? (
                              <CheckCircle className="w-5 h-5 text-[#0a7a54] shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-[#9ca3af] shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-medium text-[#0f1f3d]">{safeguard.title}</span>
                                <span
                                  className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full ${
                                    safeguard.state === "in force"
                                      ? "bg-[#10b981]/10 text-[#0a7a54]"
                                      : safeguard.state === "committed"
                                      ? "bg-[#c9920a]/10 text-[#8a6607]"
                                      : "bg-[#6b7280]/10 text-[#6b7280]"
                                  }`}
                                >
                                  {safeguard.state}
                                </span>
                              </div>
                              <p className="text-sm text-[#6b7280]">{safeguard.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Tools and certification</h3>
                      <p className="text-sm text-[#6b7280] leading-relaxed">
                        The AIC platform is a tool. Using it neither raises nor lowers an
                        organisation&apos;s chance of certification, which is decided only against
                        the published standard, by assessors who treat evidence the same way
                        wherever it came from.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Reporting Concerns</h3>
                      <p className="mb-3">
                        If you believe AIC has violated its impartiality commitments, you may report concerns confidentially to:
                      </p>
                      <div className="bg-aic-paper border border-[#e5e7eb] rounded-lg p-4">
                        <div className="text-sm space-y-2">
                          <div>
                            <strong>Email:</strong> {CONTACT_EMAIL}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Offered a "Full Impartiality Policy (PDF)" that does
                        not exist — no such file has ever been in public/. A
                        formal policy document is one of the five workstreams
                        UKAS named as prerequisites for accreditation; until it
                        exists, this page IS the statement, and says so. */}
                    <div className="pt-6 border-t border-[#e5e7eb]">
                      <p className="text-sm text-[#6b7280] leading-relaxed">
                        The full statement, with the conflict of interest
                        prohibitions, declaration obligations and how it is
                        reviewed, is at{" "}
                        <Link href="/impartiality" className="text-[#8a6114] underline underline-offset-2">
                          the Statement of Impartiality
                        </Link>
                        . A separate formal policy document is being prepared as
                        part of the management-system work required for
                        accreditation; when it exists it will be published and
                        dated.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Accreditation Status */}
            <TabsContent value="accreditation">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <Card className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#c9920a]/10 rounded-lg flex items-center justify-center shrink-0">
                        <Shield className="w-6 h-6 text-[#c9920a]" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-[#0f1f3d] mb-2">
                          AIC is not yet accredited
                        </h2>
                        <p className="text-[#0f1f3d] leading-relaxed">
                          No accreditation body has yet assessed AIC. We are not
                          accredited by UKAS, SANAS, DAkkS or any other signatory
                          of the IAF multilateral arrangement, and no certificate
                          AIC issues today carries accredited status. Anyone
                          deciding whether to rely on us should know that first,
                          which is why it is the first line on this page.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#e5e7eb] pt-6 space-y-6">
                      <div>
                        <h3 className="font-semibold text-[#0f1f3d] mb-2">The scheme we are pursuing</h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                          AIC&apos;s application to UKAS is for accreditation as a certification body for{" "}
                          <strong className="text-[#0f1f3d]">ISO/IEC 42001</strong>, the AI management
                          system standard. A body that certifies management systems is assessed against{" "}
                          <strong className="text-[#0f1f3d]">ISO/IEC 17021-1</strong>, and for AI
                          management systems also against{" "}
                          <strong className="text-[#0f1f3d]">ISO/IEC 42006</strong>, which adds
                          requirements specific to auditing AI. Accreditation, once granted, would cover
                          ISO/IEC 42001 certificates. It would not on its own cover certification against
                          the AIC standard, which is AIC&apos;s own published scheme and is unaccredited.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0f1f3d] mb-3">Where the application stands</h3>
                        <ol className="space-y-3">
                          {[
                            {
                              date: "12 June 2026",
                              text: "Application forms submitted to UKAS, the United Kingdom Accreditation Service. UKAS is AIC's primary accreditation path.",
                            },
                            {
                              date: "8 July 2026",
                              text: "UKAS returned an indicative pre-estimate covering application, pre-assessment, initial assessment and the surveillance cycle.",
                            },
                            {
                              date: "July 2026 — current position",
                              text: "AIC has deliberately paused progression. Accreditation requires witnessed assessments of live certification work, which means real clients being audited in real conditions. We do not have those yet, so an assessment now would be assessing an empty schedule. UKAS confirmed in writing that this sequencing is the right one and that progressing once live certification activity exists places AIC in a stronger position.",
                            },
                          ].map((item, i) => (
                            <li key={i} className="flex gap-4">
                              <div className="shrink-0 w-8 h-8 rounded-full bg-[#f0f4f8] border border-[#e5e7eb] flex items-center justify-center text-xs font-semibold text-[#0f1f3d]">
                                {i + 1}
                              </div>
                              <div>
                                <div className="text-xs font-mono uppercase tracking-wide text-[#9ca3af] mb-1">
                                  {item.date}
                                </div>
                                <p className="text-sm text-[#6b7280] leading-relaxed">{item.text}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0f1f3d] mb-2">Other bodies engaged</h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                          SANAS, the South African National Accreditation System, has been engaged
                          and the conversation is open but has not progressed to assessment. DAkkS
                          in Germany was approached and has not responded. Neither is an
                          accreditation, and we list them so the picture is complete rather than
                          flattering.
                        </p>
                      </div>

                      <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-lg p-6">
                        <h3 className="font-semibold text-[#0f1f3d] mb-2">
                          What this means if you are considering certification
                        </h3>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                          Founding-cohort clients are certified by an unaccredited body, and should
                          treat the certificate on that basis. In exchange, their audits are the
                          witnessed activity that accreditation requires — so the founding cohort
                          is not a discount on rigour, it is the evidence base the accreditation is
                          built from. We would rather state that plainly than sell a badge whose
                          standing we have overstated.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Certified Directory */}
            <TabsContent value="directory">
              {/* This tab was a second, hardcoded copy of the register that would
                  have stayed empty after /registry, which reads live data,
                  started listing certificates. It now points to the real one. */}
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-semibold text-[#0f1f3d] mb-2">Public register</h2>
                <p className="text-[#0f1f3d] leading-relaxed mb-6">
                  No organisation currently holds AIC certification. When one does, it appears on the
                  public register, where anyone can check whether a certificate is current without
                  asking the organisation that holds it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/registry" className="inline-flex items-center gap-2 rounded-lg bg-[#0a1628] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1f3d]">
                    Search the register <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link href="/verify" className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] px-5 py-2.5 text-sm font-semibold text-[#0f1f3d] hover:border-[#0f1f3d]">
                    Verify a certificate
                  </Link>
                </div>
              </Card>
            </TabsContent>

            {/* Appeals Process */}
            <TabsContent value="appeals">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <Card className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0a1628] rounded-lg flex items-center justify-center shrink-0">
                        <Scale className="w-6 h-6 text-[#c9920a]" />
                      </div>
                      <div>
                      <h2 className="text-2xl font-semibold text-[#0f1f3d] mb-2">Appeals and Dispute Resolution</h2>
                        <p className="text-sm text-[#6b7280]/80">
                          Fair, transparent process for challenging certification decisions
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 text-[#0f1f3d] leading-relaxed">
                      <div>
                        <h3 className="font-semibold text-[#0f1f3d] mb-3">Grounds for Appeal</h3>
                        <p className="mb-3">You may file an appeal if you believe:</p>
                        <ul className="space-y-2">
                          {[
                            "A certification decision was based on incorrect or incomplete information",
                            "The assessment process did not follow AIC's published procedures",
                            "There was a conflict of interest or bias in the assessment team",
                            "The certification decision is inconsistent with international standards",
                          ].map((ground, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-[#c9920a] shrink-0 mt-0.5" />
                              <span>{ground}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-lg p-6">
                        <h4 className="font-semibold text-[#0f1f3d] mb-1">Appeal Process Timeline</h4>
                        {/* Marked as undertakings, not as a running process.
                            AIC has issued no certificates, so no appeal has
                            ever been filed and none of these intervals has
                            been tested. Stage 3 previously read "Independent
                            Review" — the independent reviewer does not exist
                            yet, which is the same claim that was removed from
                            the impartiality tab, restated as a timeline. */}
                        <p className="text-sm text-[#6b7280] mb-4 leading-relaxed">
                          These are the intervals AIC commits to. No appeal has
                          been filed, because no certificate has been issued, so
                          none of them has yet been tested in practice.
                        </p>
                        <div className="space-y-3">
                          {[
                            { step: "1", title: "Submit appeal", time: "Within 30 days of the decision" },
                            { step: "2", title: "Acknowledgement", time: "Within 5 business days" },
                            { step: "3", title: "Review by an assessor not involved in the original decision", time: "30–45 days" },
                            { step: "4", title: "Final decision", time: "Within 60 days of submission" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                                {item.step}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-[#0f1f3d]">{item.title}</div>
                                <div className="text-sm text-[#6b7280]">{item.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0f1f3d] mb-3">How to File an Appeal</h3>
                        <div className="bg-aic-paper border border-[#e5e7eb] rounded-lg p-5">
                          <div className="space-y-3 text-sm">
                            <div>
                              <strong>Email:</strong> {CONTACT_EMAIL}
                            </div>
                            <div className="pt-3 border-t border-[#e5e7eb]">
                              <strong>Required Information:</strong> Certificate number (if applicable), detailed
                              description of grounds for appeal, supporting documentation, and contact information.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* "Download Appeals Form" and "View Full Appeals Policy" pointed at
                        files that have never existed. Email is the route. */}
                    <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=Appeal`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0a1628] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1f3d]"
                      >
                        Email an appeal
                      </a>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="font-semibold text-[#0f1f3d] mb-4">Recent Appeals Activity</h3>
                    <p className="text-sm text-[#6b7280]/80 mb-6">
                      Transparency report showing recent appeals filed and their outcomes (anonymized per confidentiality
                      requirements). No appeals have been filed yet.
                    </p>
                    <div className="space-y-3">
                      {appealCases.map((appeal, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-[#f0f4f8] rounded-lg border border-[#e5e7eb]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#0a1628] rounded-lg flex items-center justify-center text-white font-mono text-xs">
                              {appeal.caseId.split("-")[2]}
                            </div>
                            <div>
                              <div className="font-medium text-[#0f1f3d]">{appeal.organization}</div>
                              <div className="text-sm text-[#6b7280]/80">
                                {appeal.issue} • Submitted {appeal.dateSubmitted}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              appeal.status === "Resolved"
                                ? "bg-[#c9920a]/10 text-[#c9920a]"
                                : "bg-[#c9920a]/10 text-[#c9920a]"
                            }
                          >
                            {appeal.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-aic-paper border-t border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-3xl text-[#0f1f3d] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
            Questions about our processes?
          </h2>
          <p className="text-[#6b7280] mb-8">
            Write to us about impartiality, accreditation or appeals, and one of the founders will answer.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Was a button with no link ("Contact Compliance Team"). */}
            <Link href="/contact" className="inline-flex items-center rounded-lg bg-[#0a1628] hover:bg-[#0f1f3d] text-white px-8 py-3 font-semibold">
              Write to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
