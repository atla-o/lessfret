<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lessfret — Devo agent guide

Lessfret is a Devo (lateral health) product. Publisher identity: **Devo / atla-o**.

This Origin repository is the working home. Public GitHub is [github.com/atla-o/lessfret](https://github.com/atla-o/lessfret).

## Hybrid Cursor process

Use **cloud agents** for web app work, GCP, GitHub, and documentation.

Use a **local Mac / My Machines** agent only when the physical device is required (device restriction, hardware, local OS settings, or anything that cannot be done in a cloud workspace). Antiporn-style device work is the usual reason to leave the cloud.

Do not default to local execution for Next.js, copy, legal pages, intake stubs, GCP project setup, or docs.

## Data and hosting

- Production app data lives on **GCP**, in a project family under Devo.
- **Do not use Firebase.**
- Do not deploy unless a human explicitly asks. Local preview is enough for this pass.
- Public host: https://lessfret.devoutshaman.com on **Cloud Run / GCP**. Do not use Cloudflare Workers, Firebase, or Vercel for this product.

## What the product is

Two pillars only:

1. Life-coach counseling — wellness / life-coach conversations. Guidance and consultation.
2. Medical care coordination — referrals, scheduling, records, visit prep, follow-ups with real licensed providers the person chooses.

Fertility and diagnostics will be overrepresented in early coordination work. That does not make Lessfret a fertility clinic or a lab.

## Language rules (hard)

Never claim or imply:

- Licensed psychotherapy, psychiatry, or clinical mental-health practice
- Therapy, therapist, patient, or diagnosis
- That Lessfret is a medical practice, treats disease, writes prescriptions, or gives medical advice
- Invented clinical outcomes, success rates, or stock “suffering patient” imagery

Prefer: coach, coaching, guidance, consultation, coordination, navigation, referral, scheduling, follow-up.

Crisis copy: this is not emergency care. People in danger should contact **local emergency services**. Do not invent a Lessfret crisis line.

## Sibling products

- **Phenomatch** — phenotype matching
- **Antiporn** — device restriction (often needs a local machine)

Do not collapse these products into Lessfret. Cross-link lightly as Devo family, not as features of this app.

## Code notes for this pass

- Next.js App Router, TypeScript, Tailwind, shadcn/ui
- Intake and board are stubs: sessionStorage plus labeled example data
- Shared legal strings live in `src/lib/legal.ts` — change the disclaimer there, not as one-off page copy
- Keep the black/white, spare Devo-adjacent aesthetic
- No fake dashboards, no vanity metrics
