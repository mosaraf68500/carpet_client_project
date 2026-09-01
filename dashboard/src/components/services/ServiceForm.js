"use client";

import { useEffect, useState } from "react";
import { createService, updateService } from "@/lib/api";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";

function toStepRows(steps) {
  return (steps || []).map((s) => ({ title: s.title, description: s.description }));
}

export default function ServiceForm({ existingService, onSuccess, onCancel }) {
  const isEditing = Boolean(existingService);

  const [title, setTitle] = useState(existingService?.title || "");
  const [intro, setIntro] = useState(existingService?.intro || "");
  const [steps, setSteps] = useState(toStepRows(existingService?.steps));
  const [isActive, setIsActive] = useState(existingService?.isActive ?? true);

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

  const addStepRow = () => setSteps((prev) => [...prev, { title: "", description: "" }]);
  const removeStepRow = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));
  const updateStepRow = (index, patch) =>
    setSteps((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanSteps = steps.filter((row) => row.title.trim() !== "" || row.description.trim() !== "");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("intro", intro);
    formData.append("steps", JSON.stringify(cleanSteps));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (isEditing) {
      formData.append("isActive", String(isActive));
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateService(existingService._id, formData);
      } else {
        await createService(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save service.");
      setSubmitting(false);
    }
  };

  const currentImageUrl = imagePreview || existingService?.image?.url;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-3xl grid-cols-1 gap-6 rounded-xs border border-border bg-white p-6 md:grid-cols-2"
    >
      <h2 className="text-lg font-semibold text-heading md:col-span-2">
        {isEditing ? "Edit Service" : "Add Service"}
      </h2>

      {error && (
        <div className="md:col-span-2">
          <ErrorState message={error} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="service_title" className="text-sm">
          Title
        </label>
        <input
          id="service_title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="service_intro" className="text-sm">
          Intro
        </label>
        <textarea
          id="service_intro"
          rows={3}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Steps</span>
        <div className="flex flex-col gap-3">
          {steps.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="text"
                  placeholder="Step title"
                  value={row.title}
                  onChange={(e) => updateStepRow(index, { title: e.target.value })}
                  className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Step description"
                  value={row.description}
                  onChange={(e) => updateStepRow(index, { description: e.target.value })}
                  className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <Button variant="linkDanger" onClick={() => removeStepRow(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="self-start" onClick={addStepRow}>
          + Add step
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Image</span>
        {currentImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentImageUrl} alt="" className="h-20 w-20 rounded-xs object-cover" />
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
        {isEditing && !imageFile && (
          <p className="text-xs text-text-light">Choose a file to replace the current image.</p>
        )}
      </div>

      {isEditing && (
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
      )}

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Create service"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
