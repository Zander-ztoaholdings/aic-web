'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-aic-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="h-px w-12 bg-aic-gold mx-auto mb-8" />

        <h2 className="text-4xl font-serif font-medium text-aic-black mb-6 tracking-tight">
          Something went wrong.
        </h2>

        <p className="text-[#6b7280] font-serif leading-relaxed mb-12 italic">
          An unexpected error occurred. Our integrity systems have logged this
          incident for review.
        </p>

        <button
          onClick={reset}
          className="inline-block px-10 py-4 bg-aic-black text-aic-paper font-mono text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-aic-gold hover:text-black transition-all duration-500 shadow-xl"
        >
          Try Again
        </button>
      </div>

      <div className="absolute bottom-12 left-12 text-[10px] font-mono text-[#6b7280]/40 uppercase tracking-widest hidden lg:block">
        AI Integrity Certification
      </div>
    </div>
  );
}
