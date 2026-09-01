"use client";

import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "@/lib/api";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";

export default function CategoryForm({ existingCategory, onSuccess, onCancel }) {
  const isEditing = Boolean(existingCategory);

  const [name, setName] = useState(existingCategory?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cleanup only — no setState here, so this isn't a "derive state from an
  // effect" pattern. The URL itself is created in the file-input's change
  // handler, an event handler, where side effects are expected.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateCategory(existingCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save category.");
      setSubmitting(false);
    }
  };

  const currentImageUrl = imagePreview || existingCategory?.image?.url;

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

      <div className="flex flex-col gap-1 md:col-span-2">
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

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Image</span>
        {currentImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentImageUrl} alt="" className="h-20 w-20 rounded-xs object-cover" />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="text-sm"
        />
        {isEditing && !imageFile && (
          <p className="text-xs text-text-light">Choose a file to replace the current image.</p>
        )}
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
