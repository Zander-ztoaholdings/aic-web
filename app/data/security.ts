/** How AIC protects data, stated once and used by /security and /trust. Keep every item true of the running platform. */
export const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Your data in transit and at rest",
    items: [
      "Every connection to aiccertified.cloud and app.aiccertified.cloud is encrypted (HTTPS), and browsers are told never to connect without it.",
      "Secrets AIC must keep, such as a provider key you choose to give us or a second-factor secret, are encrypted individually with AES-256-GCM under keys that can be rotated.",
      "Passwords are stored only as bcrypt hashes. Nobody at AIC can read your password.",
      "Evidence files are fingerprinted (SHA-256) when you upload them, and the fingerprint is checked every time an assessor opens one.",
    ],
  },
  {
    title: "Keeping organisations apart",
    items: [
      "Every query for an organisation's data is scoped to that organisation in the application, and the database enforces the same separation with row-level security on a restricted database account.",
      "Your continuity record is hash-chained: each entry includes a fingerprint of the one before it, so an edit or deletion anywhere in the record is detectable.",
    ],
  },
  {
    title: "Who at AIC can see what",
    items: [
      "Access inside AIC is by role. Assessors see the organisations they assess; administration of accounts is limited to a small number of named people.",
      "Every administrative change (a role change, a suspended account, an evidence decision) requires a written reason and is recorded with who made it and when.",
      "Client accounts require a second factor at sign-in.",
    ],
  },
  {
    title: "Connected systems",
    items: [
      "GitHub is read through an AIC app you install on the repositories you choose. Every permission it requests is read-only, and you can uninstall it at any time.",
      "AI-provider usage reaches AIC either through an exporter you run, so AIC never sees your provider key, or through a read-only key you choose to give us, which is encrypted and deleted when you disconnect.",
      "AIC never reads prompts, model outputs, source code or your customers' data from a connected system.",
    ],
  },
  {
    title: "Backups and continuity",
    items: [
      "The database and evidence store are backed up every night, encrypted, to storage separate from the servers that run the platform. The key that decrypts them is not kept on those servers.",
      "Restoring from backup is tested regularly, not assumed.",
    ],
  },
  {
    title: "If something goes wrong",
    items: [
      "If personal information in our care is accessed without authorisation, we will tell the affected organisations and the Information Regulator as soon as reasonably possible, as section 22 of POPIA requires, and say what happened and what we are doing about it.",
      "Code changes are reviewed and tested automatically before they reach production, and dependencies are monitored for known vulnerabilities.",
    ],
  },
];
