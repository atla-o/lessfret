import Link from "next/link";
import { crisisLine, parentBrand, productName, shortDisclaimer } from "@/lib/legal";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-background text-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Disclaimer
          </p>
          <p className="max-w-xl text-sm leading-6 text-foreground/80">
            {shortDisclaimer}
          </p>
          <p className="max-w-xl text-sm leading-6 text-foreground/80">
            {crisisLine}
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {productName}
          </p>
          <ul className="space-y-2 text-foreground/80">
            <li>
              <Link href="/intake" className="hover:text-foreground">
                Start an intake
              </Link>
            </li>
            <li>
              <Link href="/coaching" className="hover:text-foreground">
                Coaching requests
              </Link>
            </li>
            <li>
              <Link href="/board" className="hover:text-foreground">
                Care-coordination board
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:text-foreground">
                Full legal notice
              </Link>
            </li>
          </ul>
          <p className="pt-4 text-xs leading-5 text-muted-foreground">
            A {parentBrand} product. Sibling work includes Phenomatch and
            Antiporn. Public family:{" "}
            <a
              href="https://devoutshaman.com"
              className="underline underline-offset-3 hover:text-foreground"
            >
              devoutshaman.com
            </a>
            . Public host:{" "}
            <a
              href="https://lessfret.devoutshaman.com"
              className="underline underline-offset-3 hover:text-foreground"
            >
              lessfret.devoutshaman.com
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
