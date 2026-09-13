import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { parentBrand, productName } from "@/lib/legal";

export function SiteHeader() {
  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-heading text-xl tracking-tight">
            {productName}
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            {parentBrand}
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
