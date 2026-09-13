# Lessfret

Wellness product under **Devo** (lateral health). Two pillars:

1. **Life-coach counseling** — coaching conversations in a wellness / life-coach lane. Not licensed psychotherapy, psychiatry, or a clinical mental-health practice. Copy uses coaching, guidance, and consultation — never therapy, therapist, patient, or diagnosis.
2. **Medical care coordination** — help navigating real care (referrals, scheduling, prep, follow-ups). Fertility and diagnostics are overrepresented early; the lane is still broad health navigation. Coordination is not treatment. No invented prescriptions, medical advice, or clinical claims.

Parent brand: Devo. Siblings: Phenomatch (phenotype matching), Antiporn (device restriction). Public family: [devoutshaman.com](https://devoutshaman.com).

**Public host:** [https://lessfret.devoutshaman.com](https://lessfret.devoutshaman.com) on Cloud Run service **`lessfret-web`** (GCP project `devo-holding`, region `us-west1`). Cloudflare is DNS-only — no Workers. That host is the production surface; there is no separate beta host.

Publisher identity: **Devo / atla-o**. This Origin repository is the working home. Public GitHub: [github.com/atla-o/lessfret](https://github.com/atla-o/lessfret).

## Run locally

```bash
npm ci
npm run dev
```

Use `npm ci` (requires the committed `package-lock.json`). `npm install` is fine only when changing dependencies.

The app listens on [http://127.0.0.1:43217](http://127.0.0.1:43217).

```bash
npm run lint
npm run build
```

App data lives in GCP project `devo-holding` (Firestore), reached by the Cloud Run app API. Do not use the Firebase client SDK or Firebase Hosting. A browser client key keeps a person’s own requests reloadable after refresh.

## Deploy (Cloud Run)

Push to `main` deploys the Next.js production image to `lessfret-web` via [`.github/workflows/deploy-lessfret-web.yml`](./.github/workflows/deploy-lessfret-web.yml). Agents must not run that deploy unless a human asks.

The image is [`Dockerfile`](./Dockerfile): Next.js `output: "standalone"`, listening on `0.0.0.0:$PORT` (Cloud Run default **8080**).

```bash
gcloud run deploy lessfret-web \
  --source . \
  --project=devo-holding \
  --region=us-west1 \
  --no-invoker-iam-check
```

**Never `--allow-unauthenticated`.** Org policy blocks `allUsers` on `roles/run.invoker`. Public traffic uses invoker IAM disabled (`--no-invoker-iam-check`, annotation `run.googleapis.com/invoker-iam-disabled`). `cloudbuild.yaml` is optional for a later Cloud Build trigger; GitHub Actions is the primary path.

GitHub Actions authenticates with Workload Identity Federation. Repository secrets:

| Secret | Value |
| --- | --- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full WIF provider resource name |
| `GCP_SERVICE_ACCOUNT` | Deploy service-account email in `devo-holding` |

One-time cutover (not part of the workflow): map `lessfret.devoutshaman.com` on Cloud Run **`lessfret-web`** instead of the holding stub `devo-web`, and keep the Cloudflare CNAME DNS-only (not proxied) to `ghs.googlehosted.com`. Do not put this app on Cloudflare Workers, Firebase, or Vercel.

## What the UI includes

- Landing page that states what Lessfret is and is not
- Coaching and care-coordination intakes that POST to `/api/intakes` and persist in Firestore (`lessfret_intakes` in `devo-holding`)
- Coaching requests and a care-coordination board that reload saved cards after refresh
- Legal notice and a persistent footer disclaimer, including crisis → local emergency services

There are no fake metrics, stock photographs, or invented clinical outcomes.

## Firestore (devo-holding)

One-time, if the Native Firestore database is not already there:

```bash
gcloud services enable firestore.googleapis.com --project=devo-holding
gcloud firestore databases create \
  --project=devo-holding \
  --location=us-west1 \
  --type=firestore-native
```

Grant the Cloud Run runtime service account `roles/datastore.user` on `devo-holding` so `lessfret-web` can read and write `lessfret_intakes`. The GitHub Actions deploy sets `GCP_PROJECT=devo-holding`. Do not deploy from an agent unless a human asks.

## Agent process

See [AGENTS.md](./AGENTS.md) for Devo’s hybrid Cursor process, language rules, and where work should run (cloud vs local Mac / My Machines).
