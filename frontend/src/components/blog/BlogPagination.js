import Link from "next/link";

// Ground truth (reference-html/blog.html): numbered pagination, not "load
// more" like /shop.
export default function BlogPagination({ currentPage, totalPages, basePath = "/blog" }) {
  if (totalPages <= 1) return null;

  const pageHref = (page) => (page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`);

  return (
    <nav aria-label="Blog pagination" className="mt-14 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="flex h-10 w-10 items-center justify-center border border-black bg-black text-sm text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className="flex h-10 w-10 items-center justify-center border border-border text-sm hover:border-black"
          >
            {page}
          </Link>
        )
      )}
    </nav>
  );
}
