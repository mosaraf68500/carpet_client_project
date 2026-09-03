import Link from "next/link";
import Image from "next/image";

// Flat, minimal card: image near the top with a small margin (not
// full-bleed), no overlay, no icon, left-aligned title + "See More" below.
// Deliberately distinct from components/common/CategoryCard.js (the plain-
// image/text-below style used on the homepage) mainly in the surface
// background and image inset — see report for the bg-surface token note.
export default function ShopCategoryCard({ name, image, href, imagePosition = "center" }) {
  return (
    <Link href={href} className="group block bg-box-grey p-4 pb-8">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ objectPosition: imagePosition }}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-left font-heading text-lg font-bold text-heading">{name}</h3>
      <span className="mt-2 flex items-center gap-2 text-left text-xs uppercase tracking-wider text-text-light transition-colors group-hover:text-primary">
        See More <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
