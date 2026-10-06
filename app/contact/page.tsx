'use client';

import Link from "next/link";
import React, { Suspense, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Globe } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

// These named a credential scheme (CAEL / SAIGS / AAEP) and an ISO/IEC 42001
// certification offering. Both were removed from the rest of the site as
// claims AIC cannot currently back — the portals advertising them were deleted
// outright — but they survived here, still being offered to anyone filling in
// the form. Descriptions now say only what AIC can stand behind. The final
// taxonomy is a commercial decision, not a technical one.
const enquiryTypes = [
  { value: "Corporate Certification", label: "Certification", description: "Having your organisation assessed against the AIC standard" },
  { value: "Platform", label: "The platform", description: "A walk-through, or a question about the workspace" },
  { value: "Workshops & Training", label: "Workshops", description: "Industry workshops mapped to the framework you already use" },
  { value: "Regulatory Coverage", label: "Regulatory map", description: "Ask us to prioritise or correct a jurisdiction" },
  { value: "Partnership / Media", label: "Partnership or press", description: "Insurers, industry bodies, researchers, vendors and journalists" },
  { value: "General Enquiry", label: "Something else", description: "Any other question or feedback" },
];

// useSearchParams requires a Suspense boundary in the App Router; without one
// the whole route is forced dynamic and the build complains.
export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}

function ContactForm() {
  const params = useSearchParams();
  // Arriving from "Ask us to prioritise <country>" on the regulatory map.
  const jurisdiction = params.get("jurisdiction")?.slice(0, 60) ?? "";
  // Arriving from a specific page rather than the nav — the empathy scorer on
  // the homepage, or the "challenge a requirement" call on /standard. Preseeds
  // the enquiry so someone who arrives mid-thought does not restart from a
  // blank form, which is where warm intent goes to die.
  const enquiry = params.get("enquiry") ?? params.get("topic") ?? "";

  const PRESETS: Record<string, { type: string; message: string }> = {
    empathy: {
      type: "Corporate Certification",
      message:
        "I'd like AIC to score our adverse customer communications against the Empathy Rubric.",
    },
    standard: {
      type: "General Enquiry",
      message: "I have a challenge to one of the published requirements: ",
    },
    partnership: { type: "Partnership / Media", message: "" },
    insurer: {
      type: "Partnership / Media",
      message: "I work for an insurer and would like to talk about testing whether AIC's record carries underwriting signal.",
    },
    platform: { type: "Platform", message: "" },
  };
  const preset = PRESETS[enquiry];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    country: jurisdiction,
    enquiryType: jurisdiction
      ? "Regulatory Coverage"
      : preset?.type ?? "",
    message: jurisdiction
      ? `Please prioritise ${jurisdiction} on the regulatory map.`
      : preset?.message ?? "",
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
              Message received
            </h2>
            <p className="text-[#6b7280] text-lg mb-6 leading-relaxed">
              Thank you, <strong>{formData.firstName}</strong>. A person at AIC reads every enquiry and will reply by email.
            </p>
            <Button
              onClick={() => { setSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", company: "", jobTitle: "", country: "", enquiryType: "", message: "" }); }}
              className="bg-[#c9920a] hover:bg-[#b07d08] text-white px-8"
            >
              Send another enquiry
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#0f1f3d]">
      <section className="bg-aic-navy text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-14 md:py-16">
          <h1 className="text-[2rem] md:text-5xl leading-[1.08] tracking-[-0.03em] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>
            Talk to AIC
          </h1>
          <p className="text-lg text-white/75 leading-[1.7] max-w-2xl mt-4">
            About certification, the platform, a workshop, the regulatory map, or working
            together. Every enquiry is read by a person, and you will hear back by email.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-6 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-10 lg:gap-14 items-start">
            <div className="order-1">
              <Card className="p-6 md:p-8 border-[#dde2e8] shadow-none rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-[#0f1f3d]">First name</label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-[#0f1f3d]">Last name</label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#0f1f3d]">Work email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-[#0f1f3d]">Organisation</label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Organisation name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="text-sm font-medium text-[#0f1f3d]">Job title</label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="Chief Risk Officer"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
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
                        className="pl-10 bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="text-sm font-medium text-[#0f1f3d] flex items-center gap-2">
                                            What are you looking for?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {enquiryTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            formData.enquiryType === type.value
                              ? "border-[#a8772a] bg-[#a8772a]/5 ring-1 ring-[#a8772a]"
                              : "border-[#dde2e8] hover:border-[#a8772a]/40 hover:bg-[#f5f7f9]"
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
                    <label htmlFor="message" className="text-sm font-medium text-[#0f1f3d]">Message <span className="text-[#5e6b7b] font-normal">(optional)</span></label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your organisation, your AI systems, or your specific requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-aic-paper border-[#e5e7eb] focus:ring-[#a8772a]/20 focus:border-[#a8772a] min-h-[120px]"
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
                      className="w-full bg-[#0f1f3d] hover:bg-[#1a3160] text-white py-6 text-base font-semibold transition-colors disabled:opacity-60"
                    >
                      {loading ? "Sending…" : "Send enquiry"}
                    </Button>
                    <p className="text-center text-xs text-[#5e6b7b] mt-4">
                      We use your details only to answer this enquiry. See the <Link href="/privacy" className="underline underline-offset-2">privacy notice</Link> for how they are kept.
                    </p>
                  </div>
                </form>
              </Card>
            </div>

            <aside className="order-2 space-y-8 lg:sticky lg:top-28">
              <div>
                <h2 className="font-semibold mb-3">Write to us directly</h2>
                <dl className="space-y-3 text-[15px]">
                  <div>
                    <dt className="text-[13px] text-[#5e6b7b]">General enquiries</dt>
                    <dd><a href="mailto:albert@ztoaholdings.com" className="hover:text-[#a8772a]">albert@ztoaholdings.com</a></dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-[#5e6b7b]">Partnerships</dt>
                    <dd><a href="mailto:zander@ztoaholdings.com" className="hover:text-[#a8772a]">zander@ztoaholdings.com</a></dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-[#5e6b7b]">Office</dt>
                    <dd className="leading-[1.55]">15 Smit Street, Johannesburg, Gauteng, 2000, South Africa</dd>
                  </div>
                </dl>
              </div>

              <div id="partners" className="scroll-mt-28 border-t border-[#dde2e8] pt-8">
                <h2 className="font-semibold mb-2">Working with AIC</h2>
                <p className="text-sm text-[#5e6b7b] leading-[1.65] mb-4">
                  AIC has no partner programme to sell you. These are the conversations we are open to,
                  and every one of them stays on the right side of the impartiality line: no partner
                  can influence whether anyone is certified.
                </p>
                <ul className="space-y-3 text-sm leading-[1.6]">
                  <li>
                    <span className="font-semibold">Insurers and brokers.</span>{" "}
                    <span className="text-[#5e6b7b]">Whether verified accountability for AI decisions carries underwriting signal.</span>{" "}
                    <Link href="/insurers" className="text-[#a8772a] underline-offset-2 hover:underline">What we offer insurers</Link>
                  </li>
                  <li>
                    <span className="font-semibold">Industry bodies.</span>{" "}
                    <span className="text-[#5e6b7b]">Mapping AI onto the frameworks your members already use, as the <Link href="/frameworks" className="text-[#a8772a] underline-offset-2 hover:underline">industry frameworks</Link> do.</span>
                  </li>
                  <li>
                    <span className="font-semibold">Researchers and journalists.</span>{" "}
                    <span className="text-[#5e6b7b]">The standard, the regulatory map and the evidence behind them.</span>
                  </li>
                  <li>
                    <span className="font-semibold">Technology vendors.</span>{" "}
                    <span className="text-[#5e6b7b]">Connecting your product to the <Link href="/platform#compliance" className="text-[#a8772a] underline-offset-2 hover:underline">platform</Link> as a source of evidence.</span>
                  </li>
                </ul>
                <p className="text-sm text-[#5e6b7b] leading-[1.65] mt-4">
                  How AIC keeps those relationships at arm&apos;s length is set out in the{" "}
                  <Link href="/impartiality" className="text-[#a8772a] underline-offset-2 hover:underline">impartiality statement</Link>.
                </p>
              </div>
            </aside>
        </div>
      </section>
    </div>
  );
}
