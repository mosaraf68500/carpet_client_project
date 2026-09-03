import Link from "next/link";
import { nav } from "@/data/siteContent";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import SearchField from "@/components/nav/SearchField";
import { MobileMenuToggle } from "@/components/nav/NavControls";
import ServicesDropdown from "@/components/nav/ServicesDropdown";
import ShopDropdown from "@/components/nav/ShopDropdown";
import { getCategories, buildCategoryTree } from "@/lib/api";

// Server Component, single-row layout: logo (left) / search (middle,
// desktop only) / nav links (right, desktop only). Only the hover-dropdowns
// and the hamburger toggle need client JS, so those stay in their own small
// client components instead of making the whole Navbar client-side. On
// mobile the search field and nav links move into MobileMenu's slide-in
// panel — this bar collapses to just the hamburger and logo.
//
// Async Server Component: fetches real categories here (not client-side in
// ShopDropdown) and passes the built tree down as a prop. Replaces the old
// hardcoded nav.megaMenu.columns flat list — nav.megaMenu.services is still
// used below for the (unrelated) Services dropdown, untouched.
export default async function Navbar() {
  const categories = await getCategories();
  const shopCategoryTree = buildCategoryTree(categories);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream">
      <Container size="header" className="flex items-center gap-4 py-4 lg:gap-6">
        <div className="lg:hidden">
          <MobileMenuToggle />
        </div>

        <Logo />

        <div className="hidden flex-1 lg:block">
          <SearchField className="mx-auto max-w-md" />
        </div>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 font-nav text-base font-medium">
            {nav.primary.map((item) => {
              if (item.isServicesDropdown) {
                return (
                  <li key={item.label} className="relative">
                    <ServicesDropdown label={item.label} links={nav.megaMenu.services.links} />
                  </li>
                );
              }
              if (item.hasMegaMenu) {
                return (
                  <li key={item.href} className="relative">
                    <ShopDropdown label={item.label} href={item.href} tree={shopCategoryTree} />
                  </li>
                );
              }
              return (
                <li key={item.href} className="relative">
                  <Link href={item.href} className="hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
