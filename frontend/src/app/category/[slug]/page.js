import { notFound } from "next/navigation";
import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import BlogGrid from "@/components/blog/BlogGrid";
import JsonLd from "@/components/common/JsonLd";
import { blogPosts } from "@/data/blogContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// Blog post category archive — matches the real categoryHref values already
// extracted onto every post in data/blogContent.js (e.g. "/category/all-posts/").
// Not to be confused with /product-category/, the site's separate taxonomy
// for shop products.
function slugify(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function getCategory(slug) {
  const post = blogPosts.find((p) => slugify(p.category) === slug);
  return post ? post.category : null;
}

export function generateStaticParams() {
  const slugs = [...new Set(blogPosts.map((p) => slugify(p.category)))];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category} | Doha Furniture أثاث الدوحة Blog`,
    description: `Posts filed under ${category} on the Doha Furniture أثاث الدوحة blog.`,
    path: `/category/${slug}/`,
  });
}

export default async function BlogCategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = blogPosts.filter((p) => p.category === category);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: category, href: null },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <PageTitleBar heading={category} breadcrumb={breadcrumb} />
      <Container size="boxed" className="py-14">
        <BlogGrid posts={posts} />
      </Container>
    </>
  );
}
