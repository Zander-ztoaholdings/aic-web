import { permanentRedirect } from "next/navigation";

// The first badge links pointed here. The badge's home is now its entry in the
// public registry; old links keep working.
export default async function LegacyVerify({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  permanentRedirect(`/registry/aware/${encodeURIComponent(code)}`);
}
