# Lessfret

Wellness product under **Devo** (lateral health). Two pillars:

1. **Life-coach counseling** — coaching conversations in a wellness / life-coach lane. Not licensed psychotherapy, psychiatry, or a clinical mental-health practice. Copy uses coaching, guidance, and consultation — never therapy, therapist, patient, or diagnosis.
2. **Medical care coordination** — help navigating real care (referrals, scheduling, prep, follow-ups). Fertility and diagnostics are overrepresented early; the lane is still broad health navigation. Coordination is not treatment. No invented prescriptions, medical advice, or clinical claims.

Parent brand: Devo. Siblings: Phenomatch (phenotype matching), Antiporn (device restriction). Public family: [devoutshaman.com](https://devoutshaman.com).

**Public host:** [https://lessfret.devoutshaman.com](https://lessfret.devoutshaman.com) on **Cloud Run / GCP** (not Cloudflare Workers). This first pass is local preview only; do not deploy unless asked.

Publisher identity: **Devo / atla-o**. This Origin repository is the working home. Public GitHub: [github.com/atla-o/lessfret](https://github.com/atla-o/lessfret).

## Run locally

```bash
npm install
npm run dev
```

The app listens on [http://127.0.0.1:43217](http://127.0.0.1:43217).

```bash
npm run lint
npm run build
```

No GCP or Vercel deploy is part of this first pass. App data is planned for a GCP project family under Devo — not Firebase. Intake in this stub stays in the browser session.

## What this first pass includes

- Landing page that states what Lessfret is and is not
- Intake stubs for coaching and care coordination (validation, submitting, error, received)
- Care-coordination board with labeled example cards
- Legal notice and a persistent footer disclaimer, including crisis → local emergency services

There are no fake metrics, stock photographs, or invented clinical outcomes.

## Agent process

See [AGENTS.md](./AGENTS.md) for Devo’s hybrid Cursor process, language rules, and where work should run (cloud vs local Mac / My Machines).
