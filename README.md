# AIC Marketing Website (`apps/web`)

This is the public-facing engine for the **AI Integrity Certification (AIC)** ecosystem. It is designed to educate enterprise prospects, qualify leads via an interactive assessment, and drive recruitment for the Alpha Program.

## ✨ Features

*   **Gallery Aesthetic:** High-end, minimalist design inspired by boutique architecture firms.
*   **Three-Tier Framework:** Detailed landing pages explaining the risk-based accountability model.
*   **Self-Assessment Quiz:** An interactive 20-question engine that calculates a preliminary "Integrity Score."
*   **Lead Generation:** Automatic database synchronization for quiz results and Alpha Program applications.
*   **PDF Report Generation:** Client-side generation of professional assessment summaries using `jsPDF`.
*   **Motion UI:** Smooth, scroll-triggered reveals and staggered entries powered by **Framer Motion**.

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Animation:** Framer Motion
*   **Styling:** Tailwind CSS 4
*   **Database:** PostgreSQL (via `@types/pg`)
*   **Analytics:** Google Analytics 4

## 🚀 Development

**1. Install dependencies:**
```bash
npm install
```

**2. Set up environment variables:**
Create a `.env` file with the following:
```env
# Single connection string — this is what lib/db actually reads.
# Split POSTGRES_USER/HOST/PORT/DB variables are NOT read and will not connect.
# In Docker/Coolify the host must be the database service name, never localhost.
DATABASE_URL=postgresql://aic_admin:your_password@localhost:5432/aic_platform
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

**3. Apply the database schema:**
```bash
npm run db:push        # apply lib/db/schema.ts directly (fine pre-launch)
# or, once real certificates exist and schema history matters:
npm run db:generate    # write a reviewable migration
npm run db:migrate     # apply it
```
Check it worked at `/api/health` — it reports the underlying error code and what
to do about it, not just "failed".

**4. Run the development server:**
```bash
npm run dev
```

## 📈 Conversion Funnel

The site is architected to track users through a 5-stage funnel:
1.  **Awareness:** Homepage / Blog
2.  **Engagement:** Tier Framework deep-dive
3.  **Interest:** Assessment Quiz start
4.  **Qualification:** Email gate at Question 15
5.  **Intent:** Alpha Program application submission

---
**© 2026 AI Integrity Certification (AIC).**