import Link from "next/link";
import { crisisLine, parentBrand, productName, shortDisclaimer } from "@/lib/legal";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-background/55">
            Disclaimer
          </p>
          <p className="max-w-xl text-sm leading-6 text-background/80">
            {shortDisclaimer}
          </p>
          <p className="max-w-xl text-sm leading-6 text-background/80">
            {crisisLine}
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-background/55">
            {productName}
          </p>
          <ul className="space-y-2 text-background/80">
            <li>
              <Link href="/intake" className="hover:text-background">
                Start an intake
              </Link>
            </li>
            <li>
              <Link href="/board" className="hover:text-background">
                Care-coordination board
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:text-background">
                Full legal notice
              </Link>
            </li>
          </ul>
          <p className="pt-4 text-xs leading-5 text-background/50">
            A {parentBrand} product. Sibling work includes Phenomatch and
            Antiporn. Public family:{" "}
            <a
              href="https://devoutshaman.com"
              className="underline underline-offset-3 hover:text-background/80"
            >
              devoutshaman.com
            </a>
            . Future public host: lessfret.devoutshaman.com — not deployed from
            this first pass.
          </p>
        </div>
      </div>
    </footer>
  );
}
