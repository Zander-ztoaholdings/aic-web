import { listRegistry } from "@/lib/registry";
import RegistryClient from "./RegistryClient";

// Server-rendered so the register reflects real data rather than a hardcoded
// array. force-dynamic: a certification status must never be served stale from
// a build artefact — a suspended certificate still showing as active is the
// exact failure this register exists to prevent.
export const dynamic = "force-dynamic";

// listRegistry() returns null when the datastore is unreachable and [] when
// nothing is certified yet. Those render differently on purpose: the second is
// the honest empty state (PRD §8.5), the first is an outage. Collapsing them
// would turn a fault into a false claim about certificates.
export default async function RegistryPage() {
  const entries = await listRegistry();
  return <RegistryClient entries={entries} />;
}
