"use client";

// The only interactive piece of the top bar itself: the mobile hamburger
// toggle. Isolated here (rather than in Navbar) so Navbar can stay a Server
// Component.
import { useUI } from "@/components/layout/UIProvider";
import { HamburgerIcon } from "@/components/common/Icons";

export function MobileMenuToggle() {
  const { openPanel } = useUI();
  return (
    <button
      type="button"
      aria-label="Toggle mobile menu"
      onClick={() => openPanel("mobileMenu")}
      className="text-black hover:text-primary"
    >
      <HamburgerIcon />
    </button>
  );
}
