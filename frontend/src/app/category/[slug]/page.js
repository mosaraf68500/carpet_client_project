import { notFound } from "next/navigation";
import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import BlogGrid from "@/components/blog/BlogGrid";
import { blogPosts } from "@/data/blogContent";
import { buildMetadata } from "@/lib/seo";

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

export function generateMetadata({ params }) {
  const category = getCategory(params.slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category} | Doha Furniture أثاث الدوحة Blog`,
    description: `Posts filed under ${category} on the Doha Furniture أثاث الدوحة blog.`,
    path: `/category/${params.slug}/`,
  });
}

export default function BlogCategoryPage({ params }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const posts = blogPosts.filter((p) => p.category === category);

  return (
    <>
      <PageTitleBar
        heading={category}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog/" },
          { label: category, href: null },
        ]}
      />
      <Container size="boxed" className="py-14">
        <BlogGrid posts={posts} />
      </Container>
    </>
  );
}
