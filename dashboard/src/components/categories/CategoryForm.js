"use client";

import { useEffect, useState } from "react";
import { createCategory, updateCategory, getCategories } from "@/lib/api";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";
import ImageUpload from "@/components/common/ImageUpload";

export default function CategoryForm({ existingCategory, onSuccess, onCancel }) {
  const isEditing = Boolean(existingCategory);

  const [name, setName] = useState(existingCategory?.name || "");
  // The list endpoint returns parentCategory as a raw id string; a single
  // category (GET /categories/:slug) returns it populated as {_id, name,
  // slug}. Handle both shapes defensively.
  const [parentCategoryId, setParentCategoryId] = useState(
    existingCategory?.parentCategory?._id || existingCategory?.parentCategory || ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState("");

  const [parentOptions, setParentOptions] = useState([]);
  const [parentOptionsStatus, setParentOptionsStatus] = useState("loading"); // loading | ready | error

  // Only top-level categories (parentCategory null) are valid parent
  // choices — mirrors the backend's 2-level constraint so the dropdown
  // never offers an option the API would reject. Also excludes this
  // category itself when editing (can't be its own parent).
  useEffect(() => {
    let cancelled = false;
    getCategories().then(
      (result) => {
        if (cancelled) return;
        setParentOptions(result.filter((c) => !c.parentCategory && c._id !== existingCategory?._id));
        setParentOptionsStatus("ready");
      },
      () => {
        if (cancelled) return;
        setParentOptionsStatus("error");
      }
    );
    return () => {
      cancelled = true;
    };
  }, [existingCategory?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setSubmitting(true);
    setUploadProgress(imageFile ? 0 : null);

    try {
      const payload = { name, parentCategory: parentCategoryId };
      if (imageFile) {
        const [uploaded] = await uploadImagesToCloudinary([imageFile], setUploadProgress);
        setUploadProgress(100);
        payload.image = uploaded;
      }

      if (isEditing) {
        await updateCategory(existingCategory._id, payload);
      } else {
        await createCategory(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save category.");
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-3xl grid-cols-1 gap-6 rounded-xs border border-border bg-white p-6 md:grid-cols-2"
    >
      <h2 className="text-lg font-semibold text-heading md:col-span-2">
        {isEditing ? "Edit Category" : "Add Category"}
      </h2>

      {error && (
        <div className="md:col-span-2">
          <ErrorState message={error} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="category_name" className="text-sm">
          Name
        </label>
        <input
          id="category_name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category_parent" className="text-sm">
          Parent Category
        </label>
        {parentOptionsStatus === "error" && (
          <p className="text-sm text-primary-text">Failed to load parent categories. Try reloading the page.</p>
        )}
        <select
          id="category_parent"
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
          disabled={parentOptionsStatus !== "ready"}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none disabled:bg-box-grey"
        >
          <option value="">{parentOptionsStatus === "loading" ? "Loading…" : "None — top level"}</option>
          {parentOptions.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <ImageUpload
          label="Image"
          existingImages={
            !imageFile && existingCategory?.image?.url
              ? [{ id: existingCategory.image.publicId, url: existingCategory.image.url }]
              : []
          }
          newFiles={imageFile ? [imageFile] : []}
          onAddFiles={(files) => setImageFile(files[0])}
          onRemoveNew={() => setImageFile(null)}
          uploadProgress={submitting ? uploadProgress : null}
          disabled={submitting}
        />
      </div>

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Create category"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
