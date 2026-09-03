import Image from "next/image";
import Link from "next/link";

// Matches reference-html/home.html's real .tm-image-box markup: plain image
// on top (no dark overlay/text-on-image), heading + optional description
// below it, "Shop now" as an underlined text link — not the boxed-button,
// image-overlay style used elsewhere on the site.
//
// `hoverImage` is optional (used by the product grid, not category grids)
// and only takes effect when it's actually a different image from `image` —
// callers may pass the same URL for both as a "no second image" fallback
// (see ProductGrid.js), which should keep the plain zoom-on-hover instead
// of cross-fading an image onto itself and losing hover feedback entirely.
export default function CategoryCard({
  name,
  image,
  hoverImage,
  href,
  description,
  featured = false,
  ctaLabel = "Shop now",
}) {
  const hasSwap = Boolean(hoverImage) && hoverImage !== image;

  return (
    <Link href={href} className="group block">
      <div className={`relative overflow-hidden ${featured ? "aspect-2/1" : "aspect-3/2"}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`object-cover ${
            hasSwap
              ? "transition-opacity duration-500 ease-in-out group-hover:opacity-0"
              : "transition-transform duration-700 ease-out group-hover:scale-105"
          }`}
        />
        {hasSwap && (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          />
        )}
      </div>
      <div className="mt-5">
        <h3 className="font-body text-xl text-accent-green sm:text-2xl">{name}</h3>
        {description && <p className="mt-2 text-sm text-button">{description}</p>}
        <span className="mt-3 inline-block border-b border-black pb-0.5 text-xs uppercase tracking-wider text-black transition-colors group-hover:border-primary group-hover:text-primary">
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}
