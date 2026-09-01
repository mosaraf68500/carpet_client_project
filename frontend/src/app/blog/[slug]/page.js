import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/common/Container";
import PageTitleBar from "@/components/common/PageTitleBar";
import ArticleBody from "@/components/blog/ArticleBody";
import ShareRow from "@/components/blog/ShareRow";
import BlogGrid from "@/components/blog/BlogGrid";
import JsonLd from "@/components/common/JsonLd";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/data/blogContent";
import { buildMetadata, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: `${post.title} | Doha Furniture أثاث الدوحة`,
    description: post.excerpt || `${post.title} — from the Doha Furniture أثاث الدوحة blog.`,
    path: post.href,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: post.title, href: null },
  ];

  return (
    <>
      {post.content && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
            ...(post.date ? { datePublished: post.date } : {}),
            image: [absoluteUrl(post.image)],
          }}
        />
      )}
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <PageTitleBar heading={post.title} breadcrumb={breadcrumb} />

      <Container size="boxed" className="py-14">
        <article className="mx-auto max-w-3xl">
          {(post.author || post.date) && (
            <div className="mb-6 flex items-center gap-4 text-sm text-text-light">
              {post.author && <span>By {post.author}</span>}
              {post.date && (
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          )}

          <div className="relative aspect-[740/480] w-full overflow-hidden bg-box-grey">
            <Image src={post.image} alt={post.alt} fill priority className="object-cover" />
          </div>

          {post.content ? (
            <ArticleBody blocks={post.content} />
          ) : (
            <p className="mt-8 text-body leading-relaxed">
              The full story is on its way — check back soon.
            </p>
          )}

          <div className="mt-12">
            <ShareRow path={post.href} title={post.title} />
          </div>
        </article>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <h3 className="mb-6 text-center font-heading text-2xl">Related Articles</h3>
            <BlogGrid posts={related} />
          </div>
        )}
      </Container>
    </>
  );
}
