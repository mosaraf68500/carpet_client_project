import Link from "next/link";
import { brand } from "@/data/siteContent";

// The original site's logo is a raster PNG with "The Carpet Cellar" wordmark
// baked into the pixels (public/images/Layer-1-720x56.png) — no text/alt-text
// replacement can rebrand an image's pixel content. Rendered as styled text
// instead so the rebrand actually shows up in the logo, not just in markup.
export default function Logo({ className = "", light = false }) {
  return (
    <Link
      href="/"
      className={`font-nav text-lg font-semibold uppercase tracking-[0.15em] sm:text-xl ${
        light ? "text-white" : "text-black"
      } ${className}`}
    >
      {brand.name}
    </Link>
  );
}
