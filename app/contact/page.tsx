'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  Clock,
  Globe,
  Users,
  MapPin,
  Mail,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

const enquiryTypes = [
  { value: "Corporate Certification", label: "Corporate Certification", description: "ISO/IEC 42001 certification for your organisation" },
  { value: "Professional Certification", label: "Professional Certification", description: "CAEL, SAIGS, or AAEP individual certification" },
  { value: "Partnership / Media", label: "Partnership / Media", description: "Strategic partnership, press, or research inquiry" },
  { value: "General Enquiry", label: "General Enquiry", description: "Other questions or feedback" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    country: "",
    enquiryType: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.jobTitle,
          country: formData.country,
          enquiryType: formData.enquiryType,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-[#c9920a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#c9920a]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0f1f3d] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
              Message Received
            </h2>
            <p className="text-[#6b7280] text-lg mb-6 leading-relaxed">
              Thank you, <strong>{formData.firstName}</strong>. We&apos;ve received your enquiry and will be in touch shortly.
            </p>
            <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#0f1f3d] mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#c9920a]" />
                What Happens Next?
              </h3>
              <ul className="space-y-2 text-sm text-[#0f1f3d]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c9920a] font-bold">1.</span>
                  <span>Our team reviews your enquiry — usually within one business day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9920a] font-bold">2.</span>
                  <span>You&apos;ll receive a tailored response with next steps for your certification path</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9920a] font-bold">3.</span>
                  <span>If applicable, we&apos;ll schedule a scoping call to discuss your requirements</span>
                </li>
              </ul>
            </div>
            <Button
              onClick={() => { setSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", company: "", jobTitle: "", country: "", enquiryType: "", message: "" }); }}
              className="bg-[#c9920a] hover:bg-[#b07d08] text-white px-8"
            >
              Back to Contact
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aic-paper">
      {/* Header */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1628]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 to-[#0a1628]/80" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-[#c9920a]" />
              <span className="text-[#c9920a] text-sm uppercase tracking-widest font-medium">
                Contact AIC
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
              Get in Touch<br />
              <span className="text-[#c9920a]">With Our Team</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              Whether you&apos;re exploring corporate certification, pursuing professional credentials, or looking to partner with AIC — we&apos;d like to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0f1f3d] mb-6" style={{ fontFamily: "'Merriweather', serif" }}>
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f0f4f8] rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#c9920a]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0f1f3d] uppercase tracking-wider font-bold opacity-70">General Enquiries</div>
                      <div className="text-[#0f1f3d] font-medium">info@aiccertified.cloud</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f0f4f8] rounded-lg flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-[#c9920a]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0f1f3d] uppercase tracking-wider font-bold opacity-70">Strategic Partnerships</div>
                      <div className="text-[#0f1f3d] font-medium">zander@ztoaholdings.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f0f4f8] rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#c9920a]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0f1f3d] uppercase tracking-wider font-bold opacity-70">Headquarters</div>
                      <div className="text-[#0f1f3d] font-medium">Johannesburg, South Africa<br />15 Smit Street, Johannesburg,<br />Gauteng, 2000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#f0f4f8] rounded-xl border border-[#e5e7eb]">
                <h3 className="font-semibold text-[#0f1f3d] mb-4">Enterprise Solutions</h3>
                <p className="text-sm text-[#0f1f3d] opacity-80 mb-4 font-medium">
                  Certifying your entire organisation? We offer enterprise-wide conformity assessment and bulk certification packages.
                </p>
                <a href="mailto:info@aiccertified.cloud" className="text-[#c9920a] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Contact Enterprise Sales <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 md:p-10 shadow-xl border-[#e5e7eb] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0f4f8] rounded-bl-full -mr-10 -mt-10 opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-[#0f1f3d]">First Name</label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-[#0f1f3d]">Last Name</label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#0f1f3d]">Professional Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-[#0f1f3d]">Company / Organisation</label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Organisation Name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="text-sm font-medium text-[#0f1f3d]">Job Title</label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="Chief Risk Officer"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium text-[#0f1f3d]">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]/60" />
                      <Input
                        id="country"
                        name="country"
                        placeholder="South Africa"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="text-sm font-medium text-[#0f1f3d] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#c9920a]" />
                      What are you looking for?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {enquiryTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            formData.enquiryType === type.value
                              ? "border-[#c9920a] bg-[#c9920a]/5 ring-1 ring-[#c9920a]"
                              : "border-[#e5e7eb] hover:border-[#c9920a]/30 hover:bg-[#f0f4f8]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="enquiryType"
                            value={type.value}
                            checked={formData.enquiryType === type.value}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 text-[#c9920a] border-[#e5e7eb] focus:ring-[#c9920a]"
                            required
                          />
                          <div>
                            <div className="font-semibold text-[#0f1f3d] text-sm">{type.label}</div>
                            <div className="text-xs text-[#6b7280] leading-snug mt-0.5">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label htmlFor="message" className="text-sm font-medium text-[#0f1f3d]">Message <span className="text-[#6b7280] font-normal">(Optional)</span></label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your organisation, your AI systems, or your specific requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-aic-paper border-[#e5e7eb] focus:ring-[#c9920a]/20 focus:border-[#c9920a] min-h-[120px]"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#c9920a] hover:bg-[#b07d08] text-white py-6 text-lg font-bold shadow-lg shadow-[#c9920a]/20 transition-all disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send Enquiry"}
                    </Button>
                    <p className="text-center text-xs text-[#6b7280]/60 mt-4">
                      By submitting this form, you agree to our privacy policy and terms of service. We will only contact you regarding your enquiry.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 text-[#c9920a] mx-auto mb-6" />
            <h2 className="text-3xl text-[#0f1f3d] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
              Join Leading AI Governance Professionals
            </h2>
            <p className="text-[#6b7280] text-lg leading-relaxed max-w-2xl mx-auto">
              Professionals from financial institutions, government agencies, and leading enterprises are already working with AIC. Position your organisation at the forefront of AI accountability.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
