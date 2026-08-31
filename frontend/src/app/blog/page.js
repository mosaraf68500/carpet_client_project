import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import { blogTitleBar, blogPosts, blogPagination } from "@/data/blogContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog | Doha Furniture أثاث الدوحة",
  description:
    "Stories, care advice, and inspiration from Doha Furniture أثاث الدوحة — the history and craft behind hand-knotted carpets from Persia, Morocco, Africa and beyond.",
  path: "/blog/",
});

export default function BlogPage() {
  return (
    <>
      <PageTitleBar heading={blogTitleBar.heading} breadcrumb={blogTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <BlogGrid posts={blogPosts} />
        <BlogPagination currentPage={blogPagination.currentPage} totalPages={blogPagination.totalPages} />
      </Container>
    </>
  );
}
