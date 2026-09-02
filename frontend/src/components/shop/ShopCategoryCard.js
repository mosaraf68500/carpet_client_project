import Link from "next/link";
import Image from "next/image";

// Full-bleed image + dark overlay + centered title/CTA, per
// shop-reference/shop-landing.html — deliberately distinct from
// components/common/CategoryCard.js, which is the plain-image/text-below
// style used on the homepage. No per-category icon: nothing in the data
// carries one, and inventing one per category would be the same kind of
// fabrication the reference explicitly warns against for images.
export default function ShopCategoryCard({ name, image, href }) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] overflow-hidden bg-box-grey sm:aspect-[3/4]"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/55" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h3 className="font-heading text-xl text-white sm:text-2xl">{name}</h3>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white transition-colors group-hover:text-primary">
          See More <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
