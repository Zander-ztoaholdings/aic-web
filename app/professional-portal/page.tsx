'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  FileText,
  BookOpen,
  Check,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Download,
  Search,
  CheckCircle,
  Shield,
  Globe,
  Target,
  Briefcase,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

const heroBg = "https://images.unsplash.com/photo-1774292476423-c3ee7ea107b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjZXJ0aWZpY2F0aW9uJTIwZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzUyNDgxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const certificationLevels = [
  {
    level: "Associate AI Ethics Practitioner",
    code: "AAEP",
    description: "Entry-level certification for professionals entering the AI governance field. Covers fundamental algorithmic rights and basic AI risk identification.",
    requirements: ["1+ year in technology or compliance", "No prior AI certification required", "Pass AAEP examination (70% threshold)"],
    duration: "4-6 months preparation",
    examFee: "$495",
    color: "border-[#e5e7eb] bg-[#f0f4f8]",
    badge: "bg-[#c9920a]/10 text-[#c9920a]",
  },
  {
    level: "Certified AI Ethics Lead",
    code: "CAEL",
    description: "Professional certification for AI Ethics Leads, Responsible AI Managers, and AI Governance Officers. Aligned with ISO/IEC 42001 requirements.",
    requirements: ["3+ years in AI governance, ethics, or risk management", "Bachelor's degree or equivalent experience", "Pass CAEL examination (75% threshold)", "Submit 2 case studies demonstrating applied governance"],
    duration: "6-9 months preparation",
    examFee: "$1,295",
    color: "border-[#c9920a]/30 bg-[#f0f4f8]",
    badge: "bg-[#c9920a] text-white",
    popular: true,
  },
  {
    level: "Senior AI Governance Specialist",
    code: "SAIGS",
    description: "Advanced certification for Chief AI Officers, VPs of AI Governance, and senior leaders. Requires demonstrated organizational impact and strategic governance implementation.",
    requirements: ["7+ years in senior AI governance or risk leadership", "Current CAEL certification (or equivalent)", "Pass SAIGS examination (80% threshold)", "Present board-level governance case study", "Peer review by two certified practitioners"],
    duration: "12+ months preparation",
    examFee: "$2,495",
    color: "border-[#e5e7eb] bg-[#f0f4f8]",
    badge: "bg-[#0a1628] text-white",
  },
];

const competencyDomains = [
  { name: "Algorithmic Rights Framework", weight: "20%", description: "Mastery of the 5 core rights and their application" },
  { name: "ISO/IEC 42001 Implementation", weight: "25%", description: "AIMS lifecycle, controls, and auditing" },
  { name: "AI Risk Management (NIST)", weight: "20%", description: "Govern, Map, Measure, Manage functions" },
  { name: "Regulatory Compliance", weight: "15%", description: "EU AI Act, GDPR, sectoral regulations" },
  { name: "Stakeholder Communication", weight: "10%", description: "Board reporting, public disclosure, incident response" },
  { name: "Applied Ethics & Case Analysis", weight: "10%", description: "Real-world governance scenarios" },
];

const upcomingExams = [
  { date: "March 15, 2026", location: "Washington, DC", seats: "12 available", code: "CAEL" },
  { date: "March 22, 2026", location: "Online Proctored", seats: "Unlimited", code: "AAEP" },
  { date: "April 10, 2026", location: "London, UK", seats: "8 available", code: "CAEL" },
  { date: "April 18, 2026", location: "Singapore", seats: "15 available", code: "SAIGS" },
  { date: "May 5, 2026", location: "Online Proctored", seats: "Unlimited", code: "CAEL" },
];

const resources = [
  { title: "ISO/IEC 42001:2023 Study Guide", type: "PDF", size: "2.4 MB", icon: FileText },
  { title: "NIST AI RMF Mapping Workbook", type: "XLSX", size: "890 KB", icon: FileText },
  { title: "Algorithmic Rights Case Compendium", type: "PDF", size: "5.1 MB", icon: BookOpen },
  { title: "Sample Exam Questions (CAEL)", type: "PDF", size: "1.2 MB", icon: FileText },
  { title: "EU AI Act Compliance Checklist", type: "PDF", size: "780 KB", icon: FileText },
  { title: "Professional Code of Conduct", type: "PDF", size: "320 KB", icon: Shield },
];

const certifiedProfessionals = [
  { name: "Dr. Sarah Chen", role: "Chief AI Officer", company: "TechGlobal Inc.", cert: "SAIGS", year: "2024" },
  { name: "Marcus Williams", role: "AI Ethics Lead", company: "FinanceSecure", cert: "CAEL", year: "2025" },
  { name: "Priya Desai", role: "Responsible AI Manager", company: "HealthAI Solutions", cert: "CAEL", year: "2025" },
  { name: "James O'Brien", role: "AI Governance Consultant", company: "Independent", cert: "SAIGS", year: "2024" },
];

export default function ProfessionalPortalPage() {
  const [activeTab, setActiveTab] = useState("certifications");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/80 via-[#0f1f3d]/75 to-[#0a1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-[#c9920a]" />
              <span className="text-[#c9920a] text-sm uppercase tracking-widest font-medium">METHODOLOGY ASSESSED</span>
            </div>
            <h1 className="text-5xl text-aic-paper mb-6" style={{ fontFamily: "'Merriweather', serif" }}>
              Professional Portal
            </h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              Earn your AIC credential — the globally recognized standard for AI Ethics Leads, Chief AI Officers, and governance professionals. Accepted in major jurisdictions worldwide.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button className="bg-[#c9920a] hover:bg-[#b07d08] text-white px-6 py-3">
                Start Your Certification Journey <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button className="bg-aic-paper/10 hover:bg-aic-paper/20 text-aic-paper border border-aic-paper/40 px-6 py-3">
                View Exam Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-aic-paper border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "Growing", label: "Certified Professionals", icon: Users },
              { value: "High", label: "Pass Rate (First Attempt)", icon: TrendingUp },
              { value: "Global", label: "Reach & Impact", icon: Globe },
              { value: "Leader", label: "Governance Standards", icon: Briefcase },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-5 h-5 text-[#c9920a] mx-auto mb-2" />
                  <div className="text-3xl font-bold text-[#0f1f3d]">{stat.value}</div>
                  <div className="text-sm text-[#6b7280] mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="certifications">Certification Levels</TabsTrigger>
              <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
              <TabsTrigger value="competencies">Competency Domains</TabsTrigger>
              <TabsTrigger value="resources">Study Resources</TabsTrigger>
              <TabsTrigger value="directory">Professional Directory</TabsTrigger>
            </TabsList>

            {/* Certifications Tab */}
            <TabsContent value="certifications">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl text-[#0f1f3d] mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                    Certification Pathways
                  </h2>
                  <p className="text-[#6b7280] max-w-2xl mx-auto">
                    AIC offers three levels of professional certification, designed to match your career stage and governance responsibilities.
                  </p>
                </div>

                {certificationLevels.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`p-8 border-2 ${cert.color} relative overflow-hidden`}>
                      {cert.popular && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#c9920a] text-white">Most Popular</Badge>
                        </div>
                      )}
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-xl ${cert.badge} flex items-center justify-center shrink-0`}>
                          <Award className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-semibold text-[#0f1f3d]">{cert.level}</h3>
                            <Badge variant="outline" className={cert.badge}>{cert.code}</Badge>
                          </div>
                          <p className="text-[#6b7280] mb-6">{cert.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold text-[#0f1f3d] mb-3">Requirements</h4>
                              <ul className="space-y-2">
                                {cert.requirements.map((req, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-[#6b7280]">
                                    <Check className="w-4 h-4 text-[#c9920a] shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#0f1f3d] mb-3">Certification Details</h4>
                              <div className="space-y-2 text-sm text-[#6b7280]">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#c9920a]" />
                                  <span>Preparation Time: {cert.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-[#c9920a]" />
                                  <span>Exam Fee: {cert.examFee}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-[#c9920a]" />
                                  <span>Valid: 3 years (renewal required)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <Button className="bg-[#0a1628] hover:bg-[#0f1f3d] text-white">
                              Apply for {cert.code}
                            </Button>
                            <Button variant="outline">Download Requirements Guide</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl text-[#0f1f3d] mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                    Upcoming Examinations
                  </h2>
                  <p className="text-[#6b7280] max-w-2xl mx-auto">
                    All exams are proctored in accordance with AIC governance standards. Online and in-person options available.
                  </p>
                </div>

                <Card className="p-6">
                  <div className="space-y-4">
                    {upcomingExams.map((exam, i) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-aic-paper border border-[#e5e7eb] rounded-lg hover:border-[#c9920a] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#0a1628] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {exam.date.split(" ")[1].replace(",", "")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#0f1f3d]">{exam.date}</span>
                              <Badge variant="outline">{exam.code}</Badge>
                            </div>
                            <div className="text-sm text-[#6b7280]">{exam.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className={exam.seats.includes("Unlimited") ? "text-[#c9920a]" : "text-[#6b7280]"}>
                              {exam.seats}
                            </span>
                          </div>
                          <Button className="bg-[#c9920a] hover:bg-[#b07d08] text-white">
                            Register Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="mt-8 p-6 bg-[#f0f4f8] border border-[#e5e7eb] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#c9920a] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#0f1f3d] mb-1">Can&apos;t find a suitable date?</h4>
                      <p className="text-sm text-[#6b7280] mb-3">
                        Request a custom exam session for your organization. Minimum 5 candidates required.
                      </p>
                      <Button size="sm" variant="outline" className="border-[#c9920a] text-[#c9920a] hover:bg-[#c9920a]/10">
                        Request Custom Session
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Competencies Tab */}
            <TabsContent value="competencies">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl text-[#0f1f3d] mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                    Competency Domains
                  </h2>
                  <p className="text-[#6b7280] max-w-2xl mx-auto">
                    All AIC exams assess competency across six core domains, weighted according to their importance in real-world governance practice.
                  </p>
                </div>

                <div className="grid gap-4">
                  {competencyDomains.map((domain, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-[#0f1f3d]">{domain.name}</h3>
                          <Badge className="bg-[#c9920a] text-white">{domain.weight}</Badge>
                        </div>
                        <p className="text-[#6b7280] text-sm mb-4">{domain.description}</p>
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                          <div
                            className="bg-[#c9920a] h-2 rounded-full"
                            style={{ width: domain.weight }}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-white border border-[#e5e7eb] rounded-lg">
                  <h4 className="font-semibold text-[#0f1f3d] mb-2">Assessment Format</h4>
                  <ul className="space-y-2 text-sm text-[#6b7280]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Multiple-choice questions (60%), case analysis (30%), and ethics scenario evaluation (10%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Timed examination (3 hours for CAEL, 4 hours for SAIGS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Results delivered within 10 business days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl text-[#0f1f3d] mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                    Study Resources
                  </h2>
                  <p className="text-[#6b7280] max-w-2xl mx-auto">
                    Free preparation materials for all AIC certification candidates. Additional paid courses available through accredited training providers.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource, i) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 bg-[#0a1628] rounded-lg flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-[#c9920a]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-[#0f1f3d] mb-1">{resource.title}</h4>
                                <div className="text-sm text-[#6b7280]">
                                  {resource.type} • {resource.size}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="shrink-0">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-[#0a1628] to-[#0f1f3d] text-white">
                    <BookOpen className="w-8 h-8 text-[#c9920a] mb-3" />
                    <h4 className="font-semibold text-lg mb-2">Accredited Training Providers</h4>
                    <p className="text-aic-paper/70 text-sm mb-4">
                      Instructor-led courses from AIC-approved training organizations. Includes live workshops and 1-on-1 mentorship.
                    </p>
                    <Button className="bg-aic-paper/10 hover:bg-aic-paper/20 text-aic-paper border border-aic-paper/40">
                      Find Training Providers
                    </Button>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-[#c9920a] to-[#b07d08] text-white">
                    <Users className="w-8 h-8 text-aic-paper mb-3" />
                    <h4 className="font-semibold text-lg mb-2">Study Groups & Community</h4>
                    <p className="text-aic-paper/90 text-sm mb-4">
                      Join peer study groups, attend webinars, and connect with certified professionals preparing for exams.
                    </p>
                    <Button className="bg-aic-paper/10 hover:bg-aic-paper/20 text-aic-paper border border-aic-paper/40">
                      Join Community
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Directory Tab */}
            <TabsContent value="directory">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl text-[#0f1f3d] mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
                    Certified Professional Directory
                  </h2>
                  <p className="text-[#6b7280] max-w-2xl mx-auto">
                    Search our public directory of AIC-certified professionals. All certifications are independently verified and maintained in our public registry.
                  </p>
                </div>

                <Card className="p-6 mb-6">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]/60" />
                      <Input
                        placeholder="Search by name, company, or certification level..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button className="bg-[#0a1628] hover:bg-[#0f1f3d] text-white">
                      Search
                    </Button>
                  </div>
                </Card>

                <div className="space-y-4">
                  {certifiedProfessionals.map((professional, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#0a1628] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {professional.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#0f1f3d]">{professional.name}</h4>
                                <Badge className="bg-[#c9920a] text-white">{professional.cert}</Badge>
                              </div>
                              <div className="text-sm text-[#6b7280]">{professional.role}</div>
                              <div className="text-sm text-[#6b7280]">{professional.company}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-[#c9920a] text-sm mb-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Verified</span>
                            </div>
                            <div className="text-xs text-[#6b7280]">Certified {professional.year}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[#6b7280] mb-3">Showing verified professionals</p>
                  <Button variant="outline">Load More Results</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#c9920a] to-[#b07d08] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-aic-paper" />
          <h2 className="text-3xl mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
            Begin Your AIC Certification Journey
          </h2>
          <p className="text-aic-paper/90 mb-8 text-lg">
            Join the global community of certified AI governance professionals. Register for your first exam or schedule a consultation to discuss your certification pathway.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-white text-[#c9920a] hover:bg-white/90 px-8 py-3">
              Register for Exam
            </Button>
            <Button className="bg-aic-paper/10 hover:bg-aic-paper/20 text-aic-paper border border-aic-paper/40 px-8 py-3">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
