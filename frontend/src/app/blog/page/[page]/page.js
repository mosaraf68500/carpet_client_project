import { notFound, redirect } from "next/navigation";
import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import BlogPagination from "@/components/blog/BlogPagination";
import JsonLd from "@/components/common/JsonLd";
import { blogTitleBar, blogPagination } from "@/data/blogContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// reference-html/blog.html's pagination links to a real page 2
// (blogPagination.nextHref), but only page 1's 12 posts were part of the
// ground-truth export — no page-2 post content was available to copy.
// TODO: replace with real page-2 posts once provided; until then this
// renders an honest "more stories coming soon" state rather than fabricating
// post content or serving a broken link.
export function generateStaticParams() {
  return [{ page: "2" }];
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  return buildMetadata({
    title: `Blog – Page ${page} | Doha Carpet سجاد الدوحة`,
    description: "More stories from the Doha Carpet سجاد الدوحة blog.",
    path: `/blog/page/${page}/`,
  });
}

export default async function BlogPagePaginated({ params }) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  if (page === 1) redirect("/blog/");
  if (!Number.isInteger(page) || page !== 2) notFound();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(blogTitleBar.breadcrumb)} />
      <PageTitleBar heading={blogTitleBar.heading} breadcrumb={blogTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14 text-center">
        <p className="text-body">More stories are on their way — check back soon.</p>
        <BlogPagination currentPage={page} totalPages={blogPagination.totalPages} />
      </Container>
    </>
  );
}
