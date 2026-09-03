import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import JsonLd from "@/components/common/JsonLd";
import { blogTitleBar, blogPosts, blogPagination } from "@/data/blogContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog | Doha Carpet سجاد الدوحة",
  description:
    "Stories, care advice, and inspiration from Doha Carpet سجاد الدوحة — the history and craft behind hand-knotted carpets from Persia, Morocco, Africa and beyond.",
  path: "/blog/",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(blogTitleBar.breadcrumb)} />
      <PageTitleBar heading={blogTitleBar.heading} breadcrumb={blogTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <BlogGrid posts={blogPosts} />
        <BlogPagination currentPage={blogPagination.currentPage} totalPages={blogPagination.totalPages} />
      </Container>
    </>
  );
}
