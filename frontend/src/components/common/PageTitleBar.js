import Link from "next/link";
import Container from "@/components/common/Container";
import JsonLd from "@/components/common/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// Shared "Shop" / "Blog" / "About Us" style title bar + breadcrumb, extracted
// so each page doesn't duplicate the same markup and Tailwind classes. Also
// emits the matching BreadcrumbList JSON-LD, since every caller already
// passes the exact items schema.org needs — one source of truth instead of
// wiring JsonLd separately on every page that has a breadcrumb.
export default function PageTitleBar({ heading, breadcrumb }) {
  return (
    <div className="bg-cream py-10 text-center">
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <Container size="boxed">
        <h1 className="font-heading text-3xl sm:text-4xl">{heading}</h1>
        <nav aria-label="Breadcrumb" className="mt-3 text-sm text-text-light">
          <ol className="flex items-center justify-center gap-2">
            {breadcrumb.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {item.href ? (
                  <Link href={item.href} className="rounded-xs hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-black" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
