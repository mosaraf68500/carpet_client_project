import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ post }) {
  return (
    <article className="group">
      <Link
        href={post.href}
        className="relative block aspect-[740/480] overflow-hidden rounded-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Image
          src={post.image}
          alt={post.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="mt-4">
        <Link
          href={post.categoryHref}
          className="text-xs font-medium uppercase tracking-wide text-button hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {post.category}
        </Link>
        <h3 className="mt-2 line-clamp-2 font-heading text-lg leading-snug">
          <Link
            href={post.href}
            className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
