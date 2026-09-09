import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  parentBrand,
  productName,
  tagline,
  whatWeAre,
  whatWeAreNot,
} from "@/lib/legal";
import { cn } from "@/lib/utils";

const pathways = [
  {
    label: "Fertility navigation",
    copy: "Help lining up consults, records, and follow-ups with licensed fertility clinics you choose. We do not provide fertility treatment.",
  },
  {
    label: "Diagnostics logistics",
    copy: "Scheduling and prep around labs or imaging a clinician has already involved. We do not order tests or read results.",
  },
  {
    label: "General health coordination",
    copy: "Referrals, calendars, visit prep, and follow-ups across ordinary care. Broad navigation — not a specialty clinic.",
  },
];

const steps = [
  {
    n: "01",
    title: "Say what you need",
    copy: "A short intake for coaching, care coordination, or both. You stay in control of what you share.",
  },
  {
    n: "02",
    title: "Coach or coordinate",
    copy: "A coaching conversation stays in the life-coach lane. Coordination work becomes tasks you can see on a board.",
  },
  {
    n: "03",
    title: "Licensed people do the clinical part",
    copy: "When care is needed, real clinicians and facilities do the medicine. Lessfret helps you get there and stay organized.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
          <div className="space-y-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {parentBrand} · lateral health
            </p>
            <h1 className="font-heading max-w-xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
              {productName}
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              {tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/intake"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Start an intake
              </Link>
              <Link
                href="/legal"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                Read the legal notice
              </Link>
            </div>
          </div>
          <aside className="self-end space-y-4 border border-foreground/10 p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              In one sentence
            </p>
            <p className="text-sm leading-6">
              Talk through life with a coach. When you need actual care, we
              help you navigate it — without pretending to be your clinician.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Two pillars
            </p>
            <h2 className="font-heading mt-3 text-4xl tracking-tight">
              Coaching, then coordination.
            </h2>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.14em]">
                Life-coach counseling
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                Conversations for direction, habits, work, relationships, and
                the stress that sits next to health logistics. Guidance and
                consultation — not psychotherapy, not psychiatry, not a
                diagnosis, and not a patient relationship.
              </p>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.14em]">
                Medical care coordination
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                Help navigating real care: referrals, scheduling, records,
                visit prep, and follow-ups. Coordination is not treatment. We
                do not write prescriptions, invent medical advice, or practice
                medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="font-heading text-3xl tracking-tight">What this is</h2>
            <ul className="mt-6 space-y-4">
              {whatWeAre.map((item) => (
                <li key={item} className="text-sm leading-7 text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-3xl tracking-tight">
              What this is not
            </h2>
            <ul className="mt-6 space-y-4">
              {whatWeAreNot.map((item) => (
                <li key={item} className="text-sm leading-7 text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Early pathways
            </p>
            <h2 className="font-heading mt-3 text-3xl tracking-tight">
              Fertility and diagnostics show up first. The lane is wider.
            </h2>
          </div>
          <Link
            href="/intake/coordination"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Coordination intake
          </Link>
        </div>
        <div className="mt-10 grid gap-px bg-foreground/10 md:grid-cols-3">
          {pathways.map((pathway) => (
            <article key={pathway.label} className="bg-background p-6">
              <h3 className="text-sm font-medium">{pathway.label}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {pathway.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="font-heading text-3xl tracking-tight">How a first pass works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="space-y-3">
                <p className="font-mono text-xs text-muted-foreground">{step.n}</p>
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {step.copy}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/intake/coaching"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Coaching intake
            </Link>
            <Link
              href="/board"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              See the example board
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
