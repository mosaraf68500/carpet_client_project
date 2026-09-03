"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories, createProduct, updateProduct } from "@/lib/api";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";

const MAX_IMAGES = 8;

function toSizeRows(sizes) {
  return (sizes || []).map((s) => ({ value: String(s.value), unit: s.unit }));
}

export default function ProductForm({ existingProduct, onSuccess, onCancel }) {
  const isEditing = Boolean(existingProduct);

  const [categories, setCategories] = useState([]);
  const [categoriesStatus, setCategoriesStatus] = useState("loading"); // loading | ready | error

  const [title, setTitle] = useState(existingProduct?.title || "");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const [category, setCategory] = useState(existingProduct?.category?._id || "");
  const [homepageSection, setHomepageSection] = useState(existingProduct?.homepageSection || "");
  const [sizes, setSizes] = useState(toSizeRows(existingProduct?.sizes));
  const [isActive, setIsActive] = useState(existingProduct?.isActive ?? true);

  const [removedPublicIds, setRemovedPublicIds] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imageWarning, setImageWarning] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((result) => {
        if (cancelled) return;
        setCategories(result);
        setCategoriesStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setCategoriesStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const remainingExistingImages = useMemo(
    () => (existingProduct?.images || []).filter((img) => !removedPublicIds.includes(img.publicId)),
    [existingProduct, removedPublicIds]
  );

  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    const previews = newImageFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    // Not derivable in render: object URLs are a real browser resource that
    // must be revoked, so creating them has to be tied to an effect's
    // cleanup rather than recomputed (and leaked) on every render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewImagePreviews(previews);
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImageFiles]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const slotsLeft = Math.max(0, MAX_IMAGES - remainingExistingImages.length);

    if (files.length > slotsLeft) {
      setImageWarning(`Only ${slotsLeft} image${slotsLeft === 1 ? "" : "s"} allowed — extra files were not added.`);
    } else {
      setImageWarning("");
    }

    setNewImageFiles(files.slice(0, slotsLeft));
    e.target.value = "";
  };

  const removeNewImage = (fileToRemove) => {
    setNewImageFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const removeExistingImage = (publicId) => {
    setRemovedPublicIds((prev) => [...prev, publicId]);
  };

  const addSizeRow = () => setSizes((prev) => [...prev, { value: "", unit: "ft" }]);
  const removeSizeRow = (index) => setSizes((prev) => prev.filter((_, i) => i !== index));
  const updateSizeRow = (index, patch) =>
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanSizes = sizes
      .filter((row) => row.value !== "")
      .map((row) => ({ value: Number(row.value), unit: row.unit }));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("sizes", JSON.stringify(cleanSizes));
    formData.append("homepageSection", homepageSection);

    if (isEditing) {
      formData.append("isActive", String(isActive));
      if (removedPublicIds.length > 0) {
        formData.append("removeImagePublicIds", JSON.stringify(removedPublicIds));
      }
    }

    newImageFiles.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct(existingProduct._id, formData);
      } else {
        await createProduct(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save product.");
      setSubmitting(false);
    }
  };

  const noCategories = categoriesStatus === "ready" && categories.length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-3xl grid-cols-1 gap-6 rounded-xs border border-border bg-white p-6 md:grid-cols-2"
    >
      <h2 className="text-lg font-semibold text-heading md:col-span-2">
        {isEditing ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div className="md:col-span-2">
          <ErrorState message={error} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="product_title" className="text-sm">
          Title
        </label>
        <input
          id="product_title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="product_category" className="text-sm">
          Category
        </label>
        {categoriesStatus === "error" && (
          <p className="text-sm text-primary-text">Failed to load categories. Try reloading the page.</p>
        )}
        {noCategories && (
          <p className="text-sm text-primary-text">No categories yet — add a category first before creating products.</p>
        )}
        <select
          id="product_category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categoriesStatus !== "ready" || noCategories}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none disabled:bg-box-grey"
        >
          <option value="" disabled>
            {categoriesStatus === "loading" ? "Loading categories…" : "Select a category"}
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="product_homepage_section" className="text-sm">
          Homepage Section
        </label>
        <select
          id="product_homepage_section"
          value={homepageSection}
          onChange={(e) => setHomepageSection(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        >
          <option value="">None</option>
          <option value="bestselling">Our Bestselling Collections</option>
          <option value="curated">World&apos;s Finest Curated Treasures</option>
          <option value="spotlight">Product Spotlight</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="product_description" className="text-sm">
          Description
        </label>
        <textarea
          id="product_description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Sizes</span>
        <div className="flex flex-col gap-2">
          {sizes.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Value"
                value={row.value}
                onChange={(e) => updateSizeRow(index, { value: e.target.value })}
                className="w-28 border border-border-form px-3 py-2 focus:border-black focus:outline-none"
              />
              <div className="flex overflow-hidden rounded-xs border border-border-form">
                <button
                  type="button"
                  onClick={() => updateSizeRow(index, { unit: "ft" })}
                  className={`px-3 py-2 text-xs ${row.unit === "ft" ? "bg-black text-white" : "bg-white text-body"}`}
                >
                  ft
                </button>
                <button
                  type="button"
                  onClick={() => updateSizeRow(index, { unit: "cm" })}
                  className={`border-l border-border-form px-3 py-2 text-xs ${row.unit === "cm" ? "bg-black text-white" : "bg-white text-body"}`}
                >
                  cm
                </button>
              </div>
              <Button variant="linkDanger" onClick={() => removeSizeRow(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="self-start" onClick={addSizeRow}>
          + Add size
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Images</span>

        {remainingExistingImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {remainingExistingImages.map((img) => (
              <div key={img.publicId} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-20 w-20 rounded-xs object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.publicId)}
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white hover:bg-primary"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          className="text-sm"
        />
        {imageWarning && <p className="text-sm text-primary-text">{imageWarning}</p>}

        {newImagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {newImagePreviews.map((preview) => (
              <div key={preview.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt="" className="h-20 w-20 rounded-xs object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(preview.file)}
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white hover:bg-primary"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
      )}

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" variant="primary" disabled={submitting || noCategories || categoriesStatus === "loading"}>
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
