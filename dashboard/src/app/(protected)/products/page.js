"use client";

import { useCallback, useEffect, useState } from "react";
import { Package } from "lucide-react";
import { getAdminProducts, deleteProduct } from "@/lib/api";
import ProductForm from "@/components/products/ProductForm";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Used by event handlers (Prev/Next, retry-after-save) — safe to call by
  // reference there since it's never invoked directly from an effect body.
  const loadProducts = useCallback(async (pageToLoad) => {
    try {
      const result = await getAdminProducts({ page: pageToLoad, limit: PAGE_SIZE });
      setProducts(result.items);
      setTotalPages(result.totalPages);
      setPage(result.page);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Failed to load products.");
      setStatus("error");
    }
  }, []);

  // Fetches inline (rather than calling loadProducts by reference) so every
  // state update stays inside a .then()/.catch() callback, not the effect's
  // own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getAdminProducts({ page: 1, limit: PAGE_SIZE }).then(
      (result) => {
        if (cancelled) return;
        setProducts(result.items);
        setTotalPages(result.totalPages);
        setPage(result.page);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load products.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      window.alert(err.message || "Failed to delete product.");
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingProduct(null);
    setStatus("loading");
    setError("");
    loadProducts(page);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setStatus("loading");
    setError("");
    loadProducts(nextPage);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-heading">Products</h1>
        {!formOpen && (
          <Button variant="primary" onClick={handleAddClick}>
            + Add Product
          </Button>
        )}
      </div>

      {formOpen && (
        <ProductForm existingProduct={editingProduct} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}

      {!formOpen && status === "loading" && <LoadingState message="Loading products…" />}

      {!formOpen && status === "error" && <ErrorState message={error} />}

      {!formOpen && status === "ready" && products.length === 0 && (
        <EmptyState icon={Package} message="No products yet — add your first one below." />
      )}

      {!formOpen && status === "ready" && products.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xs border border-border bg-white">
            <table className="w-full min-w-180 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-box-grey text-xs uppercase tracking-wide text-text-light">
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Sizes</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      {product.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0].url} alt="" className="h-12 w-12 rounded-xs object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-xs bg-box-grey" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-heading">{product.title}</td>
                    <td className="px-4 py-3 text-body">{product.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-body">
                      {product.sizes?.length || 0} size{product.sizes?.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-xs px-2 py-1 text-xs font-medium ${
                          product.isActive ? "bg-accent-green/10 text-accent-green" : "bg-box-grey text-text-light"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        <Button variant="link" onClick={() => handleEditClick(product)}>
                          Edit
                        </Button>
                        <Button variant="linkDanger" onClick={() => handleDelete(product)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-sm text-body hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-body">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm text-body hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
