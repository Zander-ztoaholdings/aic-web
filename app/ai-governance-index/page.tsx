'use client';

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Award,
  CheckCircle,
  Building2,
  Globe,
  Shield,
  Calendar,
  ExternalLink,
  BadgeCheck,
  Scale,
  MapPin,
  Lock,
  Fingerprint,
  History,
  AlertCircle,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface AuditEvent {
  date: string;
  type: string;
  result: "Pass" | "Minor NC" | "Major NC";
  auditor: string;
}

interface ComplianceMetric {
  framework: string;
  score: number;
  status: "Full" | "Partial" | "Critical";
}

interface CertifiedCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
  certificationDate: string;
  expiryDate: string;
  status: "Active" | "Pending" | "Suspended";
  certificateNumber: string;
  scope: string;
  certifiedProfessionals: number;
  website: string;
  integrityScore: number;
  leadAuditor: string;
  accreditationBody: string;
  complianceMatrix: ComplianceMetric[];
  auditHistory: AuditEvent[];
  transparencyUrl: string;
  aiEthicsOfficer: string;
}

const companies: CertifiedCompany[] = [
  {
    id: "msft-001",
    name: "Microsoft Corporation",
    industry: "Technology",
    location: "Redmond, USA",
    certificationDate: "2025-01-15",
    expiryDate: "2028-01-14",
    status: "Active",
    certificateNumber: "AIC-2025-MSFT-001",
    scope: "Global Azure AI services and OpenAI integration layer including model safety guardrails and automated content moderation systems.",
    certifiedProfessionals: 142,
    website: "https://microsoft.com",
    integrityScore: 96,
    leadAuditor: "Dr. Sarah Chen (AIC Senior Fellow)",
    accreditationBody: "AIC Methodology Assessed",
    transparencyUrl: "https://microsoft.com/ai/transparency",
    aiEthicsOfficer: "Natasha Crampton",
    complianceMatrix: [
      { framework: "EU AI Act", score: 98, status: "Full" },
      { framework: "NIST AI RMF", score: 95, status: "Full" },
      { framework: "ISO/IEC 42001", score: 96, status: "Full" },
    ],
    auditHistory: [
      { date: "2025-01-15", type: "Certification Audit", result: "Pass", auditor: "AIC Global" },
      { date: "2024-11-20", type: "Stage 2 Technical Review", result: "Minor NC", auditor: "AIC Global" },
      { date: "2024-10-05", type: "Stage 1 Readiness", result: "Pass", auditor: "AIC Global" },
    ],
  },
  {
    id: "jpm-002",
    name: "JPMorgan Chase & Co.",
    industry: "Financial Services",
    location: "New York, USA",
    certificationDate: "2025-03-10",
    expiryDate: "2028-03-09",
    status: "Active",
    certificateNumber: "AIC-2025-JPM-002",
    scope: "Internal algorithmic credit scoring, fraud detection systems, and automated wealth management advisory engines.",
    certifiedProfessionals: 85,
    website: "https://jpmorganchase.com",
    integrityScore: 92,
    leadAuditor: "Marcus Thorne (Certified Lead Auditor)",
    accreditationBody: "AIC Methodology Assessed",
    transparencyUrl: "https://jpmorganchase.com/ai-governance",
    aiEthicsOfficer: "James Cummins",
    complianceMatrix: [
      { framework: "EU AI Act", score: 91, status: "Full" },
      { framework: "NIST AI RMF", score: 93, status: "Full" },
      { framework: "SEC Rule 240", score: 94, status: "Full" },
    ],
    auditHistory: [
      { date: "2025-03-10", type: "Certification Audit", result: "Pass", auditor: "AIC Global" },
      { date: "2025-01-12", type: "Pre-assessment", result: "Pass", auditor: "AIC Global" },
    ],
  },
  {
    id: "fin-004",
    name: "Sovereign Bank",
    industry: "Financial Services",
    location: "Johannesburg, RSA",
    certificationDate: "2025-08-05",
    expiryDate: "2028-08-04",
    status: "Active",
    certificateNumber: "AIC-2025-SOV-004",
    scope: "Retail banking automated decision systems, customer risk profiles, and POPIA-compliant automated processing modules.",
    certifiedProfessionals: 12,
    website: "https://sovereign.bank",
    integrityScore: 94,
    leadAuditor: "Thabo Mbeki (AIC RSA Division)",
    accreditationBody: "AIC Methodology Assessed",
    transparencyUrl: "https://sovereign.bank/governance",
    aiEthicsOfficer: "Elena Rodriguez",
    complianceMatrix: [
      { framework: "POPIA Sec 71", score: 99, status: "Full" },
      { framework: "EU AI Act", score: 92, status: "Full" },
      { framework: "ISO/IEC 42001", score: 94, status: "Full" },
    ],
    auditHistory: [
      { date: "2025-08-05", type: "Certification Audit", result: "Pass", auditor: "AIC Africa" },
    ],
  },
];

// ─── Helper sub-components ────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af]">
      <span className="text-[#c9920a]">{icon}</span>
      {label}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="py-2.5 border-b border-white/5 last:border-0">
      <div className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${highlight ? "text-[#c9920a]" : "text-white"}`}>{value}</div>
    </div>
  );
}

function InfoRowLight({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 border-b border-[#f0f4f8] last:border-0">
      <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm font-medium text-[#0f1f3d]">{value}</div>
    </div>
  );
}

// ─── Notion-style Peek Modal ──────────────────────────────────────────────

function PeekModal({
  company,
  onClose,
}: {
  company: CertifiedCompany;
  onClose: () => void;
}) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      />

      {/* Centered modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 pointer-events-none"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative w-full max-w-[92vw] xl:max-w-[1400px] max-h-[92vh] bg-white rounded-2xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cover band */}
          <div className="relative h-32 bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#162640] shrink-0">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9920a] to-transparent" />

            {/* Status */}
            <div className="absolute top-4 left-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9920a] bg-[#c9920a]/15 border border-[#c9920a]/30 px-3 py-1.5 rounded-full">
                {company.status} Certification
              </span>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Identity row */}
          <div className="px-8 pt-5 pb-5 border-b border-[#f1f1f0] shrink-0">
            <div className="flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-[#f0f4f8] border border-[#e5e7eb] flex items-center justify-center shadow-sm">
                <Building2 className="w-7 h-7 text-[#c9920a]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0f1f3d] leading-tight">
                  {company.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-[#6b7280]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#c9920a]" />{company.industry}
                  </span>
                  <span className="text-[#d1d5db] hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c9920a]" />{company.location}
                  </span>
                  <span className="text-[#d1d5db] hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#c9920a]" />{company.certificateNumber}
                  </span>
                </div>
              </div>
              {/* Score pill */}
              <div className="shrink-0 text-center px-5 py-3 bg-[#0a1628] rounded-xl">
                <div className="text-2xl font-bold text-[#c9920a] leading-none">{company.integrityScore}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/50 mt-1">Score</div>
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main — 2 cols */}
              <div className="lg:col-span-2 space-y-10">

                {/* Scope */}
                <section>
                  <SectionLabel icon={<Shield className="w-3.5 h-3.5" />} label="Verified Certification Scope" />
                  <blockquote className="mt-4 border-l-[3px] border-[#c9920a] pl-5 py-1 text-[#374151] leading-relaxed italic text-[15px]">
                    &ldquo;{company.scope}&rdquo;
                  </blockquote>
                </section>

                {/* Regulatory matrix */}
                <section>
                  <SectionLabel icon={<Scale className="w-3.5 h-3.5" />} label="Regulatory Alignment Matrix" />
                  <div className="mt-4 grid sm:grid-cols-3 gap-4">
                    {company.complianceMatrix.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 hover:border-[#c9920a]/40 transition-colors"
                      >
                        <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">
                          {item.framework}
                        </div>
                        <div className="flex items-end justify-between mb-3">
                          <span className="text-3xl font-bold text-[#0f1f3d]">{item.score}%</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.status === "Full"
                                ? "bg-[#10b981]/10 text-[#10b981]"
                                : item.status === "Partial"
                                ? "bg-[#c9920a]/10 text-[#c9920a]"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#c9920a] rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Audit trail */}
                <section>
                  <SectionLabel icon={<History className="w-3.5 h-3.5" />} label="Independent Audit Trail" />
                  <div className="mt-4 space-y-2">
                    {company.auditHistory.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-5 py-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] hover:border-[#c9920a]/30 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <span className="text-xs font-mono text-[#9ca3af] w-24 shrink-0">{event.date}</span>
                          <div>
                            <div className="text-sm font-semibold text-[#111827]">{event.type}</div>
                            <div className="text-xs text-[#6b7280]">by {event.auditor}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shrink-0 ${
                            event.result === "Pass"
                              ? "bg-[#10b981]/10 text-[#10b981]"
                              : "bg-[#c9920a]/10 text-[#c9920a]"
                          }`}
                        >
                          {event.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar — 1 col */}
              <div className="space-y-5">

                {/* Seal card */}
                <Card className="p-6 bg-[#0a1628] border-none rounded-2xl text-white overflow-hidden relative">
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#c9920a]/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[#c9920a] text-[10px] font-bold uppercase tracking-widest mb-5">
                      <Award className="w-3.5 h-3.5" /> Integrity Seal
                    </div>
                    <InfoRow label="Lead Auditor" value={company.leadAuditor} />
                    <InfoRow label="AI Ethics Officer" value={company.aiEthicsOfficer} />
                    <InfoRow label="Accreditation Body" value={company.accreditationBody} />
                    <InfoRow label="Certified Professionals" value={String(company.certifiedProfessionals)} />
                    <InfoRow label="Valid Until" value={company.expiryDate} highlight />
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="p-5 border border-[#e5e7eb] rounded-2xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] mb-4">
                    <Calendar className="w-3.5 h-3.5" /> Timeline
                  </div>
                  <InfoRowLight label="Certified" value={company.certificationDate} />
                  <InfoRowLight label="Expires" value={company.expiryDate} />
                </Card>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e7eb] text-[#0f1f3d] text-sm font-medium transition-colors">
                    Certification Report (PDF)
                    <Download className="w-4 h-4 text-[#6b7280]" />
                  </button>
                  <button className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e7eb] text-[#0f1f3d] text-sm font-medium transition-colors">
                    Transparency Disclosure
                    <ExternalLink className="w-4 h-4 text-[#6b7280]" />
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs text-[#9ca3af] hover:text-red-500 hover:bg-red-50 transition-colors">
                    <AlertCircle className="w-3.5 h-3.5" /> Report Audit Discrepancy
                  </button>
                </div>

                {/* QR placeholder */}
                <div className="p-6 border-2 border-dashed border-[#e5e7eb] rounded-2xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-[#f0f4f8] rounded-xl mb-3 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-[#d1d5db]" />
                  </div>
                  <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-widest">
                    Scan to Verify Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Registry grid ────────────────────────────────────────────────────────

function RegistryContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CertifiedCompany | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const companyId = searchParams.get("company");
    if (companyId) {
      const company = companies.find((c) => c.id === companyId);
      if (company) setSelectedCompany(company);
    }
  }, [searchParams]);

  const handleOpen = (company: CertifiedCompany) => {
    setSelectedCompany(company);
    const params = new URLSearchParams(searchParams.toString());
    params.set("company", company.id);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const handleClose = () => {
    setSelectedCompany(null);
    window.history.pushState(null, "", window.location.pathname);
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-[#0f1f3d] mb-4">AIC Verified Registry</h1>
        <p className="text-xl text-[#6b7280] max-w-3xl leading-relaxed">
          The central authority for algorithmic accountability. Search the official public registry of organizations
          that have achieved AIC Certification and verified their commitment to responsible AI.
        </p>
      </div>

      {/* Search */}
      <div className="mb-12">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <Input
            placeholder="Search by company name, industry, or certificate number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(9);
            }}
            className="pl-12 h-14 bg-white border-[#e5e7eb] rounded-xl text-lg shadow-sm focus:ring-[#c9920a]"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.slice(0, visibleCount).map((company) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => handleOpen(company)}
          >
            <Card className="p-8 h-full border-[#e5e7eb] hover:border-[#c9920a] hover:shadow-xl transition-all duration-300 bg-white group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-[#f0f4f8] rounded-xl group-hover:bg-[#c9920a]/10 transition-colors">
                  <Building2 className="w-7 h-7 text-[#0f1f3d] group-hover:text-[#c9920a]" />
                </div>
                <Badge className="bg-[#c9920a] text-white px-3 py-1">
                  <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                  Verified
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-[#0f1f3d] mb-2">{company.name}</h3>
              <p className="text-[#6b7280] mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {company.industry} · {company.location}
              </p>
              <div className="space-y-4 pt-6 border-t border-[#f0f4f8]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6b7280] font-medium uppercase tracking-wider text-[10px]">
                    Registry Status
                  </span>
                  <span className="text-[#10b981] font-bold px-2 py-0.5 bg-[#10b981]/10 rounded text-sm">
                    {company.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6b7280] font-medium uppercase tracking-wider text-[10px]">
                    Integrity Score
                  </span>
                  <span className="text-[#0f1f3d] font-bold text-lg">
                    {company.integrityScore}
                    <span className="text-[10px] text-[#6b7280] font-normal">/100</span>
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {visibleCount < filteredCompanies.length && (
        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            variant="outline"
            className="px-12 py-6 rounded-full border-2 border-[#0f1f3d] text-[#0f1f3d] hover:bg-[#0f1f3d] hover:text-white font-bold transition-all text-lg"
          >
            Load More Verified Organizations
          </Button>
        </div>
      )}

      {/* Peek modal */}
      <AnimatePresence>
        {selectedCompany && (
          <PeekModal company={selectedCompany} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AIGovernanceIndexPage() {
  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-[#6b7280]">
            Loading Registry…
          </div>
        }
      >
        <RegistryContent />
      </Suspense>

      {/* Methodology strip */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Award className="w-16 h-16 text-[#c9920a] mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">The Global Benchmark for AI Integrity</h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-12">
            The AIC Registry is the world&apos;s most trusted record of algorithmic accountability. Organizations
            listed here have undergone rigorous technical and ethical audits to verify their compliance with
            global standards.
          </p>
          <div className="flex flex-wrap gap-8 justify-center opacity-80">
            {[
              "Independent Third-Party Audits",
              "ISO/IEC 42001 Alignment",
              "Quarterly Integrity Monitoring",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#c9920a]" />
                <span className="text-sm font-medium tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
