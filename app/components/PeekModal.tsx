"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Notion-style centre peek modal.
 *
 * Grown out of the PeekModal MVP built for the governance index, generalised so
 * articles and policy updates can share it.
 *
 * It is used with Next.js intercepting routes, which matters more than it
 * sounds: clicking an article opens this modal and updates the URL, but a
 * direct visit, a refresh, a shared link or a crawler still gets the full page
 * at that URL. A modal-only pattern would have taken every article out of the
 * index and thrown away the per-article metadata and Article structured data.
 *
 * Accessibility: labelled dialog, focus moved in on open and restored on close,
 * focus kept inside while open, Escape and backdrop both close, and background
 * scroll locked.
 */
export default function PeekModal({
  children,
  label,
}: {
  children: React.ReactNode;
  /** Accessible name for the dialog — usually the item's title. */
  label: string;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    router.back();
  }, [router]);

  // Lock background scroll while open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Move focus in, and put it back where it was on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previouslyFocused.current?.focus?.();
  }, []);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        onClick={close}
        aria-hidden="true"
      />

      <motion.div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className="relative w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col pointer-events-auto outline-none"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="overflow-y-auto overscroll-contain">{children}</div>
        </div>
      </motion.div>
    </>
  );
}
