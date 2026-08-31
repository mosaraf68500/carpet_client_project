import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ name, image, href, featured = false }) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden ${
        featured ? "aspect-[4/3]" : "aspect-[3/4]"
      }`}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-6 text-center">
        <h3 className="font-heading text-lg text-white sm:text-xl">{name}</h3>
        <span className="border-b border-white pb-0.5 text-xs uppercase tracking-wider text-white">
          Shop now
        </span>
      </div>
    </Link>
  );
}
