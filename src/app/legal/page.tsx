import type { Metadata } from "next";
import {
  crisisLine,
  parentBrand,
  productName,
  publisher,
  shortDisclaimer,
  whatWeAre,
  whatWeAreNot,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal notice",
  description: `${productName} legal scope: coaching and care coordination, not therapy or medical practice.`,
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 px-5 py-14 md:py-20">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Legal
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          What {productName} is allowed to be
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          {shortDisclaimer}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl tracking-tight">Crisis</h2>
        <p className="text-sm leading-7">{crisisLine}</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl tracking-tight">We are</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
          {whatWeAre.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl tracking-tight">We are not</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
          {whatWeAreNot.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl tracking-tight">
          Language we avoid
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Product copy does not call this therapy, call coaches therapists,
          call people patients, or claim a diagnosis. Coordination copy does
          not claim treatment, prescriptions, test interpretation, or clinical
          outcomes. Fertility and diagnostics are navigation pathways, not
          practiced specialties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl tracking-tight">This first pass</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Intake notes stay in the browser session. The coordination board
          includes labeled example cards. No app data is written to Firebase.
          Production data is planned for a GCP project family under{" "}
          {parentBrand}. Publisher identity: {publisher}. This Origin
          repository is the working home. Public source: github.com/atla-o/lessfret.
          Public host (Cloud Run / GCP, not Cloudflare Workers):
          lessfret.devoutshaman.com.
        </p>
      </section>
    </div>
  );
}
