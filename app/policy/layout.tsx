import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy Updates",
  description:
    "Regulatory and standards developments affecting accountable AI, each recorded with its primary source.",
  alternates: { canonical: "/policy" },
};

// `modal` renders alongside `children` and stays empty (see @modal/default.tsx)
// until an intercepting route fills it, at which point an update opens as a
// centre peek over the list instead of navigating away.
export default function PolicyLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
