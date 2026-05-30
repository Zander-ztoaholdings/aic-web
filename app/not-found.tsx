"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-aic-paper flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-aic-navy rounded-2xl flex items-center justify-center shadow-xl shadow-aic-navy/10">
              <Shield className="w-10 h-10 text-aic-copper" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-aic-navy mb-4 font-mono">404</h1>
          <h2 className="text-3xl font-serif italic text-aic-navy mb-6">Page Not Found</h2>
          
          <p className="text-[#6b7280] mb-10 text-lg leading-relaxed">
            The resource you are looking for does not exist or has been moved within our accountability registry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-aic-navy text-aic-paper px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest font-mono hover:bg-aic-navy-mid transition-all shadow-lg shadow-aic-navy/10"
            >
              <Home className="w-4 h-4" /> Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 border-2 border-aic-navy text-aic-navy px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest font-mono hover:bg-aic-paper transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
