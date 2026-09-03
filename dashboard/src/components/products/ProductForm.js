"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories, createProduct, updateProduct } from "@/lib/api";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";
import ImageUpload from "@/components/common/ImageUpload";

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

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100, or null when not uploading
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

  const addNewImages = (files) => setNewImageFiles((prev) => [...prev, ...files]);

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

    const hasUploads = newImageFiles.length > 0;
    setSubmitting(true);
    setUploadProgress(hasUploads ? 0 : null);

    try {
      const uploaded = await uploadImagesToCloudinary(newImageFiles, setUploadProgress);
      if (hasUploads) setUploadProgress(100);

      const payload = {
        title,
        description,
        category,
        sizes: cleanSizes,
        homepageSection,
        images: [...remainingExistingImages, ...uploaded],
      };
      if (isEditing) {
        payload.isActive = isActive;
      }

      if (isEditing) {
        await updateProduct(existingProduct._id, payload);
      } else {
        await createProduct(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save product.");
      setSubmitting(false);
      setUploadProgress(null);
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

      <div className="md:col-span-2">
        <ImageUpload
          multiple
          maxFiles={MAX_IMAGES}
          label="Images"
          existingImages={remainingExistingImages.map((img) => ({ id: img.publicId, url: img.url }))}
          newFiles={newImageFiles}
          onAddFiles={addNewImages}
          onRemoveExisting={removeExistingImage}
          onRemoveNew={removeNewImage}
          uploadProgress={submitting ? uploadProgress : null}
          disabled={submitting}
        />
      </div>

      {isEditing && (
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
      )}

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" variant="primary" disabled={submitting || noCategories || categoriesStatus === "loading"}>
          {submitting
            ? uploadProgress !== null
              ? uploadProgress < 100
                ? `Uploading… ${uploadProgress}%`
                : "Processing…"
              : "Saving…"
            : isEditing
              ? "Save changes"
              : "Create product"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
