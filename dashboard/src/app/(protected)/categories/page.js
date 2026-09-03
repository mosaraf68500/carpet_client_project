"use client";

import { useEffect, useState } from "react";
import { FolderTree } from "lucide-react";
import { getCategories, deleteCategory } from "@/lib/api";
import CategoryForm from "@/components/categories/CategoryForm";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

// Re-orders the flat, name-sorted list from the API so each subcategory
// sits directly under its parent (the API only sorts by name, which would
// otherwise scatter a subcategory anywhere in the alphabet, undermining
// the point of indenting it). Any subcategory whose parent isn't in this
// list (shouldn't normally happen) still appears, just not grouped.
function groupByHierarchy(categories) {
  const topLevel = categories.filter((c) => !c.parentCategory);
  const grouped = [];
  for (const top of topLevel) {
    grouped.push(top);
    grouped.push(...categories.filter((c) => c.parentCategory === top._id));
  }
  const groupedIds = new Set(grouped.map((c) => c._id));
  grouped.push(...categories.filter((c) => !groupedIds.has(c._id)));
  return grouped;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Used by event handlers (post-save refresh) — safe to call by reference
  // there since it's never invoked directly from an effect body.
  const refresh = () => {
    setStatus("loading");
    setError("");
    getCategories().then(
      (result) => {
        setCategories(result);
        setStatus("ready");
      },
      (err) => {
        setError(err.message || "Failed to load categories.");
        setStatus("error");
      }
    );
  };

  // Fetches inline (rather than calling refresh by reference) so every
  // state update stays inside a .then()/.catch() callback, not the effect's
  // own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getCategories().then(
      (result) => {
        if (cancelled) return;
        setCategories(result);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load categories.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(category._id);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (err) {
      // Surfaces the backend's own message, e.g. "Cannot delete — 3
      // product(s) still use this category. Reassign or delete them first."
      window.alert(err.message || "Failed to delete category.");
    }
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingCategory(null);
    refresh();
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-heading">Categories</h1>
        {!formOpen && (
          <Button variant="primary" onClick={handleAddClick}>
            + Add Category
          </Button>
        )}
      </div>

      {formOpen && (
        <CategoryForm existingCategory={editingCategory} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}

      {!formOpen && status === "loading" && <LoadingState message="Loading categories…" />}

      {!formOpen && status === "error" && <ErrorState message={error} />}

      {!formOpen && status === "ready" && categories.length === 0 && (
        <EmptyState icon={FolderTree} message="No categories yet — add your first one below." />
      )}

      {!formOpen && status === "ready" && categories.length > 0 && (
        <div className="overflow-x-auto rounded-xs border border-border bg-white">
          <table className="w-full min-w-140 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-box-grey text-xs uppercase tracking-wide text-text-light">
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupByHierarchy(categories).map((category) => {
                const parent = category.parentCategory
                  ? categories.find((c) => c._id === category.parentCategory)
                  : null;
                return (
                  <tr key={category._id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      {category.image?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.image.url} alt="" className="h-12 w-12 rounded-xs object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-xs bg-box-grey" />
                      )}
                    </td>
                    <td className={`px-4 py-3 font-medium text-heading ${parent ? "pl-10" : ""}`}>
                      {category.name}
                      {parent && <p className="text-xs font-normal text-text-light">Under: {parent.name}</p>}
                    </td>
                    <td className="px-4 py-3 text-body">{category.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        <Button variant="link" onClick={() => handleEditClick(category)}>
                          Edit
                        </Button>
                        <Button variant="linkDanger" onClick={() => handleDelete(category)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
