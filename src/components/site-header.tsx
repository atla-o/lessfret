import Link from "next/link";
import { parentBrand, productName } from "@/lib/legal";

const links = [
  { href: "/intake", label: "Intake" },
  { href: "/board", label: "Coordination" },
  { href: "/legal", label: "Legal" },
];

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
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
