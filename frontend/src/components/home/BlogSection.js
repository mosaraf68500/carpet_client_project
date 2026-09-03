import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { blogSection } from "@/data/siteContent";
import { blogPosts } from "@/data/blogContent";

// Heading/description copy still comes from siteContent.js, but the posts
// themselves are the real /blog data's first 3 entries (its display order,
// same as /blog itself — most posts have no date field to sort by), linking
// to their real /blog/[slug] pages instead of the old broken top-level
// hrefs siteContent.js's own mock posts used to point at.
const latestPosts = blogPosts.slice(0, 3);

export default function BlogSection() {
  return (
    <Container as="section" size="boxed" className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl sm:text-4xl">{blogSection.heading}</h2>
        <p className="mt-4 text-body">{blogSection.description}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {latestPosts.map((post) => (
          <Link key={post.href} href={post.href} className="group flex flex-col gap-4">
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="text-xs uppercase tracking-wide text-button">{post.category}</span>
            <h3 className="font-heading text-lg group-hover:text-primary">{post.title}</h3>
          </Link>
        ))}
      </div>
    </Container>
  );
}
