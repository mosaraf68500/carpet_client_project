import Image from "next/image";
import Link from "next/link";

// Matches reference-html/home.html's real .tm-image-box markup: plain image
// on top (no dark overlay/text-on-image), heading + optional description
// below it, "Shop now" as an underlined text link — not the boxed-button,
// image-overlay style used elsewhere on the site.
export default function CategoryCard({ name, image, href, description, featured = false }) {
  return (
    <Link href={href} className="group block">
      <div className={`relative overflow-hidden ${featured ? "aspect-2/1" : "aspect-3/2"}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-5">
        <h3 className="font-body text-xl text-accent-green sm:text-2xl">{name}</h3>
        {description && <p className="mt-2 text-sm text-button">{description}</p>}
        <span className="mt-3 inline-block border-b border-black pb-0.5 text-xs uppercase tracking-wider text-black transition-colors group-hover:border-primary group-hover:text-primary">
          Shop now
        </span>
      </div>
    </Link>
  );
}
