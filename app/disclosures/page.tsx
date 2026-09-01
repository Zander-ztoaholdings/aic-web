'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Scale,
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Globe,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

const heroBg = "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGNvbXBsaWFuY2UlMjBkb2N1bWVudGF0aW9uJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NTI0ODExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface CertifiedOrganization {
  name: string;
  industry: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Suspended" | "Expired";
  scope: string;
  country: string;
}

const certifiedOrgs: CertifiedOrganization[] = [];

const appealCases: { caseId: string; organization: string; dateSubmitted: string; status: string; issue: string }[] = [];

export default function DisclosuresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("impartiality");

  const filteredOrgs = certifiedOrgs.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.certNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 to-[#0a1628]/80" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#c9920a]" />
              <span className="text-[#c9920a] text-sm uppercase tracking-widest font-medium">
                Mandatory Disclosures
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Methodology", value: "Assessed" },
              { icon: Globe, label: "Recognition", value: "Global" },
              { icon: Users, label: "Founding Cohort", value: "Forming" },
              { icon: Building2, label: "Public Registry", value: "Opening Soon" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
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
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="impartiality">Impartiality Statement</TabsTrigger>
              <TabsTrigger value="accreditation">Accreditation Status</TabsTrigger>
              <TabsTrigger value="directory">Certified Directory</TabsTrigger>
              <TabsTrigger value="appeals">Appeals Process</TabsTrigger>
            </TabsList>

            {/* Impartiality Statement */}
            <TabsContent value="impartiality">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
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
                      <p className="text-sm text-[#6b7280]/80">Last updated: February 1, 2026</p>
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
                            <li>Training that compromises impartiality</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Independence Safeguards</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Financial Independence",
                            desc: "Our impartiality policy commits us to: no single client representing more than 15% of annual revenue.",
                          },
                          {
                            title: "Personnel Separation",
                            desc: "Auditors may not assess organisations they have consulted for within the preceding 3 years.",
                          },
                          {
                            title: "Board Oversight",
                            desc: "Conflict of interest allegations are referred to an independent ethics committee.",
                          },
                          {
                            title: "Public Accountability",
                            desc: "Annual impartiality report published and audited by accreditation body.",
                          },
                        ].map((safeguard, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-aic-paper rounded-lg border border-[#e5e7eb]">
                            <CheckCircle className="w-5 h-5 text-[#c9920a] shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-[#0f1f3d] mb-1">{safeguard.title}</div>
                              <p className="text-sm text-[#6b7280]">{safeguard.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0f1f3d] mb-2">Reporting Concerns</h3>
                      <p className="mb-3">
                        If you believe AIC has violated its impartiality commitments, you may report concerns confidentially to:
                      </p>
                      <div className="bg-aic-paper border border-[#e5e7eb] rounded-lg p-4">
                        <div className="text-sm space-y-2">
                          <div>
                            <strong>Email:</strong> info@aiccertified.cloud
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#e5e7eb] flex gap-3">
                      <Button className="bg-[#0a1628] hover:bg-[#0f1f3d] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Impartiality Policy (PDF)
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Accreditation Status */}
            <TabsContent value="accreditation">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
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
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-semibold text-[#0f1f3d]">Methodology Assessment</h2>
                        </div>
                        <p className="text-sm text-[#6b7280]/80">AIC&apos;s certification methodology is currently undergoing assessment to ensure alignment with international best practices.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Certified Directory */}
            <TabsContent value="directory">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-[#0f1f3d] mb-2">
                        Certified Organizations
                      </h2>
                      <p className="text-sm text-[#6b7280]/80">
                        The public registry opens with our founding cohort, currently forming.
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]/60" />
                    <Input
                      placeholder="Search by organization name, industry, or certificate number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredOrgs.map((org, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border border-[#e5e7eb] rounded-lg p-5 bg-aic-paper hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-[#0f1f3d] text-lg">{org.name}</h3>
                              <Badge
                                className={
                                  org.status === "Active"
                                    ? "bg-[#c9920a]/10 text-[#c9920a]"
                                    : org.status === "Suspended"
                                    ? "bg-[#c9920a]/10 text-[#c9920a]"
                                    : "bg-[#d4183d]/10 text-[#d4183d]"
                                }
                              >
                                {org.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-[#6b7280]/80">
                              {org.industry} • {org.country}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-[#6b7280]/80 mb-1">Certificate Number</div>
                            <div className="font-mono text-[#0f1f3d]">{org.certNumber}</div>
                          </div>
                          <div>
                            <div className="text-[#6b7280]/80 mb-1">Validity Period</div>
                            <div className="text-[#0f1f3d]">
                              {org.issueDate} — {org.expiryDate}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-[#6b7280]/80 mb-1">Certification Scope</div>
                            <div className="text-[#0f1f3d]">{org.scope}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredOrgs.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-[#e5e7eb] rounded-lg text-[#6b7280]/80 text-sm">
                      No organisation currently holds AIC certification. The register opens with our founding cohort.
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>

            {/* Appeals Process */}
            <TabsContent value="appeals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
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
                        <h4 className="font-semibold text-[#0f1f3d] mb-3">Appeal Process Timeline</h4>
                        <div className="space-y-3">
                          {[
                            { step: "1", title: "Submit Appeal", time: "Within 30 days of decision" },
                            { step: "2", title: "Acknowledgment", time: "Within 5 business days" },
                            { step: "3", title: "Independent Review", time: "30-45 days" },
                            { step: "4", title: "Final Decision", time: "Within 60 days of submission" },
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
                              <strong>Email:</strong> info@aiccertified.cloud
                            </div>
                            <div className="pt-3 border-t border-[#e5e7eb]">
                              <strong>Required Information:</strong> Certificate number (if applicable), detailed
                              description of grounds for appeal, supporting documentation, and contact information.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex gap-3">
                      <Button className="bg-[#0a1628] hover:bg-[#0f1f3d] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Appeals Form
                      </Button>
                      <Button variant="outline">View Full Appeals Policy</Button>
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
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-aic-paper border-t border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl text-[#0f1f3d] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
            Questions About Our Processes?
          </h2>
          <p className="text-[#6b7280] mb-8">
            Our compliance team is available to answer questions about impartiality, accreditation, or appeals procedures.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-[#0a1628] hover:bg-[#0f1f3d] text-white px-8 py-3">Contact Compliance Team</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
