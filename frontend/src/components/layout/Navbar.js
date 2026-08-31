import Link from "next/link";
import { nav } from "@/data/siteContent";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import NavControls, { MobileMenuToggle } from "@/components/nav/NavControls";
import ServicesDropdown from "@/components/nav/ServicesDropdown";

// Server Component: only the pieces that truly need interactivity
// (hamburger/login/search/cart/currency in NavControls, the Services
// hover-dropdown) are client components — everything else here renders
// statically on the server.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-cream">
      {/* Top bar — present in the source markup but rendered empty (no widgets assigned). */}
      <div className="hidden" />

      <div className="border-b border-cream-dark">
        <Container size="header" className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4 lg:hidden">
            <MobileMenuToggle />
          </div>

          <Logo className="mx-auto lg:mx-0" />

          <NavControls />
        </Container>
      </div>

      <nav className="hidden border-b border-cream-dark bg-cream lg:block" aria-label="Primary">
        <Container size="header">
          <ul className="flex justify-center gap-10 py-3 font-nav text-base font-medium">
            {nav.primary.map((item) =>
              item.isServicesDropdown ? (
                <li key={item.label} className="relative">
                  <ServicesDropdown label={item.label} links={nav.megaMenu.services.links} />
                </li>
              ) : (
                <li key={item.href} className="relative">
                  <Link href={item.href} className="hover:text-primary">
                    {item.label}
                  </Link>
                  {/* item.hasMegaMenu content intentionally not rendered: hidden via
                      `.old-menu{display:none}` on the source site. See data/siteContent.js. */}
                </li>
              )
            )}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
