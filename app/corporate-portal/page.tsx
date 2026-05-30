'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Users,
  Building2,
  Clock,
  BarChart3,
  Lock,
  RefreshCw,
  Search,
  Globe,
} from "lucide-react";

const heroBg = "https://images.unsplash.com/photo-1771931322109-180bb1b35bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjByaXNrJTIwbWFuYWdlbWVudCUyMGNvbXBsaWFuY2UlMjBhdWRpdHxlbnwxfHx8fDE3NzE5NjI2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080";

const certificationTiers = [
  {
    tier: "Foundation",
    code: "ISO/IEC 42001 – Level 1",
    price: "$12,400",
    duration: "4–6 weeks",
    color: "#c9920a",
    features: [
      "AI Risk Inventory Assessment",
      "Gap Analysis Report (50+ controls)",
      "AIMS Policy Template Package",
      "Readiness Scorecard",
      "1 Remediation Consultation Session",
    ],
    audience: "Organizations initiating AI governance programs",
  },
  {
    tier: "Professional",
    code: "ISO/IEC 42001 – Level 2",
    price: "$38,000",
    duration: "8–12 weeks",
    color: "#c9920a",
    featured: true,
    features: [
      "Full AIMS Implementation Audit",
      "Risk Treatment Plan Development",
      "ISO/IEC 42001 Certification (3-year cycle)",
      "Algorithmic Rights Compliance Review",
      "NIST AI RMF Cross-Mapping",
      "3 Surveillance Audits included",
      "Chief Risk Officer Briefing Package",
    ],
    audience: "Mid-to-large enterprises deploying AI at scale",
  },
  {
    tier: "Enterprise",
    code: "ISO/IEC 42001 – Level 3",
    price: "Custom",
    duration: "12–24 weeks",
    color: "#0a1628",
    features: [
      "Multi-site AIMS Certification",
      "Board-level AI Governance Assessment",
      "Regulatory Alignment (EU AI Act, CCPA, etc.)",
      "Dedicated Certification Manager",
      "Annual AI Maturity Benchmarking",
      "AIC Global AI Governance Index Listing",
      "White-glove Appeals Management",
      "Unlimited Surveillance Audits",
    ],
    audience: "Fortune 500 companies and regulated industries",
  },
];

const gapControls = [
  { domain: "AI Strategy & Governance", controls: 12, completed: 9, risk: "Low" },
  { domain: "Risk Management Framework", controls: 18, completed: 11, risk: "Medium" },
  { domain: "Data Governance & Privacy", controls: 15, completed: 13, risk: "Low" },
  { domain: "Model Lifecycle Management", controls: 20, completed: 8, risk: "High" },
  { domain: "Algorithmic Rights Compliance", controls: 10, completed: 4, risk: "High" },
  { domain: "Incident Response & Monitoring", controls: 14, completed: 10, risk: "Medium" },
  { domain: "Human Oversight Mechanisms", controls: 8, completed: 6, risk: "Low" },
  { domain: "Third-Party AI Procurement", controls: 11, completed: 5, risk: "High" },
];

const riskTemplates = [
  { title: "AI Risk Register Template", desc: "Comprehensive 200-row risk register aligned to ISO/IEC 42001 Annex A controls and NIST AI RMF categories.", type: "Excel / CSV", size: "248 KB" },
  { title: "AIMS Policy Framework", desc: "Pre-populated AI Management System policy templates for Board, Executive, and Operational levels.", type: "Word / PDF", size: "1.2 MB" },
  { title: "Algorithmic Impact Assessment", desc: "Structured AIA form for assessing high-risk AI system deployments under EU AI Act Article 9 requirements.", type: "PDF / Word", size: "387 KB" },
  { title: "Vendor AI Due Diligence Checklist", desc: "40-point checklist for evaluating third-party AI provider compliance and contractual accountability.", type: "PDF / Excel", size: "156 KB" },
  { title: "AI Incident Response Playbook", desc: "Step-by-step playbook for classifying, responding to, and reporting AI system failures or biased outcomes.", type: "PDF", size: "892 KB" },
  { title: "NIST AI RMF Gap Analysis Workbook", desc: "Structured workbook mapping current controls to GOVERN, MAP, MEASURE, and MANAGE functions.", type: "Excel", size: "312 KB" },
];

const certifiedOrgs = [
  { name: "Meridian Financial Group", sector: "Finance", tier: "Enterprise", since: "2024", score: 94 },
  { name: "NovaTech Healthcare Systems", sector: "Healthcare", tier: "Professional", since: "2024", score: 88 },
  { name: "Apex Logistics Corp.", sector: "Supply Chain", tier: "Professional", since: "2023", score: 85 },
  { name: "GlobalEdge Insurance", sector: "Insurance", tier: "Enterprise", since: "2025", score: 91 },
  { name: "Pinnacle HR Solutions", sector: "HR Technology", tier: "Foundation", since: "2025", score: 76 },
];

export default function CorporatePortalPage() {
  const [activeTab, setActiveTab] = useState<"certification" | "gap" | "templates" | "directory" | string>("certification");
  const [searchOrg, setSearchOrg] = useState("");

  const filteredOrgs = certifiedOrgs.filter(
    (o) =>
      o.name.toLowerCase().includes(searchOrg.toLowerCase()) ||
      o.sector.toLowerCase().includes(searchOrg.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/82 to-[#0a1628]/65" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#c9920a]" />
            <span className="text-[#c9920a] text-sm uppercase tracking-widest">Corporate Portal</span>
          </div>
          <h1 className="text-5xl text-aic-paper mb-4" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
            ISO/IEC 42001 Certification<br />
            <span className="text-[#c9920a]">for Your Organization</span>
          </h1>
          <p className="text-aic-paper/70 text-lg max-w-2xl mb-8">
            Achieve internationally recognized AI Management System certification. AIC&apos;s conformity assessment services help Chief Risk Officers build defensible, auditable AI governance programs.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("certification")}
              className="bg-[#c9920a] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#b07d08] transition-colors"
            >
              View Certification Tiers
            </button>
            <button
              onClick={() => setActiveTab("gap")}
              className="bg-aic-paper/10 text-aic-paper border border-aic-paper/20 px-6 py-3 rounded-lg text-sm font-medium hover:bg-aic-paper/20 transition-colors"
            >
              Run Gap Analysis
            </button>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <div className="bg-aic-paper border-b border-[#e5e7eb] sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { id: "certification", label: "Certification Services", icon: Shield },
              { id: "gap", label: "Gap Analysis Tool", icon: BarChart3 },
              { id: "templates", label: "Risk Templates", icon: FileText },
              { id: "directory", label: "Certified Organizations", icon: Building2 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-[#c9920a] text-[#0f1f3d]"
                    : "border-transparent text-[#6b7280] hover:text-[#0f1f3d] hover:border-[#e5e7eb]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Certification Services */}
        {activeTab === "certification" && (
          <div>
            <div className="text-center mb-12">
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">ISO/IEC 42001</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                AI Management System Certification
              </h2>
              <p className="text-[#6b7280] max-w-2xl mx-auto text-sm">
                Select the certification tier that matches your organization's AI deployment scale, regulatory exposure, and governance maturity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certificationTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative border rounded-2xl overflow-hidden ${tier.featured ? "shadow-2xl scale-105" : "shadow-sm"}`}
                >
                  {tier.featured && (
                    <div className="absolute top-0 left-0 right-0 text-center py-2 text-aic-paper text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: tier.color }}>
                      Most Popular
                    </div>
                  )}
                  <div className={`p-8 ${tier.featured ? "mt-8" : ""}`}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: tier.color + "15" }}
                    >
                      <Shield className="w-5 h-5" style={{ color: tier.color }} />
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#6b7280]/60 mb-1">{tier.code}</div>
                    <h3 className="text-xl font-bold text-[#0f1f3d] mb-1">{tier.tier}</h3>
                    <div className="text-2xl font-bold mb-1" style={{ color: tier.color }}>{tier.price}</div>
                    <div className="flex items-center gap-1 text-xs text-[#6b7280]/60 mb-5">
                      <Clock className="w-3 h-3" />
                      {tier.duration} timeline
                    </div>
                    <p className="text-xs text-[#6b7280] mb-5 italic">{tier.audience}</p>
                    <ul className="space-y-2.5 mb-8">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#6b7280]">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: tier.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        backgroundColor: tier.featured ? tier.color : "transparent",
                        color: tier.featured ? "aic-paper" : tier.color,
                        border: `2px solid ${tier.color}`,
                      }}
                    >
                      {tier.price === "Custom" ? "Request Proposal" : "Begin Assessment"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Globe, label: "Global Presence", sub: "Internationally recognized" },
                { icon: Lock, label: "Methodology", sub: "Assessed & verified" },
                { icon: RefreshCw, label: "3-year cycle", sub: "With annual surveillance" },
                { icon: Users, label: "Dedicated CRM", sub: "Your account manager" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-4 bg-[#f0f4f8] rounded-xl border border-[#e5e7eb]">
                    <Icon className="w-8 h-8 text-[#c9920a] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#0f1f3d] text-sm">{item.label}</div>
                      <div className="text-[#6b7280]/60 text-xs">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gap Analysis Tool */}
        {activeTab === "gap" && (
          <div>
            <div className="mb-10">
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">Free Tool</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                ISO/IEC 42001 Gap Analysis Dashboard
              </h2>
              <p className="text-[#6b7280] max-w-2xl text-sm">
                This indicative gap analysis shows control coverage across eight key ISO/IEC 42001 domains. Use AIC&apos;s full assessment service for a defensible, audited baseline.
              </p>
            </div>

            {/* Overall score */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <div className="md:col-span-1 bg-[#0a1628] rounded-2xl p-6 text-white text-center">
                <div className="text-5xl font-bold text-[#c9920a]">61%</div>
                <div className="text-aic-paper/70 text-sm mt-1">Overall Readiness</div>
                <div className="text-aic-paper/40 text-xs mt-2">vs. 78% industry avg.</div>
                <div className="mt-4 h-2 bg-aic-paper/10 rounded-full">
                  <div className="h-2 rounded-full bg-[#c9920a]" style={{ width: "61%" }}></div>
                </div>
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                {[
                  { label: "High Risk Gaps", value: "3", color: "text-[#d4183d]", bg: "bg-[#d4183d]/10 border-[#d4183d]/20" },
                  { label: "Medium Risk Gaps", value: "2", color: "text-[#c9920a]", bg: "bg-[#c9920a]/10 border-[#c9920a]/20" },
                  { label: "Low Risk Gaps", value: "3", color: "text-[#1a3160]", bg: "bg-[#1a3160]/10 border-[#e5e7eb]" },
                  { label: "Controls Met", value: "66/108", color: "text-[#0f1f3d]", bg: "bg-[#f0f4f8] border-[#e5e7eb]" },
                  { label: "Controls Partial", value: "22/108", color: "text-[#c9920a]", bg: "bg-[#c9920a]/10 border-[#c9920a]/20" },
                  { label: "Controls Missing", value: "20/108", color: "text-[#d4183d]", bg: "bg-[#d4183d]/10 border-[#d4183d]/20" },
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${item.bg}`}>
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-[#6b7280] mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {gapControls.map((control, i) => {
                const pct = Math.round((control.completed / control.controls) * 100);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-aic-paper border border-[#e5e7eb] rounded-xl p-5 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            control.risk === "High" ? "bg-[#d4183d]" :
                            control.risk === "Medium" ? "bg-[#c9920a]" : "bg-[#1a3160]"
                          }`}
                        ></span>
                        <span className="font-medium text-[#0f1f3d] text-sm">{control.domain}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          control.risk === "High" ? "bg-[#d4183d]/10 text-[#d4183d]" :
                          control.risk === "Medium" ? "bg-[#c9920a]/10 text-[#c9920a]" :
                          "bg-[#1a3160]/10 text-[#1a3160]"
                        }`}>
                          {control.risk} Risk
                        </span>
                        <span className="text-xs text-[#6b7280]/60">{control.completed}/{control.controls} controls</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#e5e7eb] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= 80 ? "bg-[#1a3160]" : pct >= 60 ? "bg-[#c9920a]" : "bg-[#d4183d]"
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${
                        pct >= 80 ? "text-[#1a3160]" : pct >= 60 ? "text-[#c9920a]" : "text-[#d4183d]"
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-[#0a1628] rounded-2xl text-center">
              <h3 className="text-aic-paper text-lg font-semibold mb-2">Get Your Official Gap Analysis Report</h3>
              <p className="text-aic-paper/60 text-sm mb-5 max-w-xl mx-auto">
                This dashboard is illustrative. AIC's certified assessors will conduct a rigorous, defensible gap analysis across all 108 ISO/IEC 42001 controls.
              </p>
              <button className="bg-[#c9920a] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#b07d08] transition-colors">
                Schedule a Formal Assessment
              </button>
            </div>
          </div>
        )}

        {/* Risk Templates */}
        {activeTab === "templates" && (
          <div>
            <div className="mb-10">
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">Resources</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                AI Risk Management Templates
              </h2>
              <p className="text-[#6b7280] max-w-2xl text-sm">
                AIC-developed tools and templates to accelerate your AI governance implementation. All templates are aligned to ISO/IEC 42001 and NIST AI RMF.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riskTemplates.map((template, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-[#e5e7eb] rounded-xl p-6 bg-aic-paper hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0a1628]/5 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-[#0f1f3d]" />
                  </div>
                  <h3 className="font-semibold text-[#0f1f3d] mb-2 text-sm">{template.title}</h3>
                  <p className="text-[#6b7280]/60 text-xs leading-relaxed mb-4">{template.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-[#f0f4f8] rounded text-[#6b7280]">{template.type}</span>
                      <span className="text-xs text-[#6b7280]/60">{template.size}</span>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-[#c9920a] font-medium hover:gap-2 transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-[#f0f4f8] border border-[#e5e7eb] rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-[#c9920a] mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-[#0f1f3d] mb-1">Templates Are Starting Points</div>
                <p className="text-[#6b7280] text-sm">
                  These templates are designed to support your AI governance program but do not constitute formal ISO/IEC 42001 certification or legal advice. Engage an AIC-certified assessor for compliance assurance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Certified Organizations Directory */}
        {activeTab === "directory" && (
          <div>
            <div className="mb-10">
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">Public Directory</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                Certified Organizations
              </h2>
              <p className="text-[#6b7280] max-w-2xl text-sm">
                Publicly searchable registry of ISO/IEC 42001-certified organizations. This directory is maintained for public transparency and verification.
              </p>
            </div>

            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]/60" />
              <input
                type="text"
                placeholder="Search organizations or sector..."
                className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20"
                value={searchOrg}
                onChange={(e) => setSearchOrg(e.target.value)}
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a1628] text-white/70 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Organization</th>
                    <th className="text-left px-5 py-3">Sector</th>
                    <th className="text-left px-5 py-3">Tier</th>
                    <th className="text-left px-5 py-3 hidden md:table-cell">Certified Since</th>
                    <th className="text-left px-5 py-3">AI Maturity Score</th>
                    <th className="text-left px-5 py-3 hidden lg:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-aic-paper">
                  {filteredOrgs.map((org, i) => (
                    <tr key={i} className="hover:bg-[#f0f4f8]">
                      <td className="px-5 py-4 font-medium text-[#0f1f3d] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#c9920a]" />
                        {org.name}
                      </td>
                      <td className="px-5 py-4 text-[#6b7280]">{org.sector}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          org.tier === "Enterprise" ? "bg-[#0a1628] text-white" :
                          org.tier === "Professional" ? "bg-[#c9920a]/10 text-[#c9920a]" :
                          "bg-[#f0f4f8] text-[#0f1f3d]"
                        }`}>
                          {org.tier}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6b7280] hidden md:table-cell">{org.since}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#e5e7eb] rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-[#c9920a]" style={{ width: `${org.score}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-[#0f1f3d]">{org.score}/100</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-[#c9920a] text-xs">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-[#6b7280]/60 text-sm">
                        No certified organizations found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
