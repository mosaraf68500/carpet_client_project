"use client";

import { useEffect, useMemo, useState } from "react";
import { createService, updateService } from "@/lib/api";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";

const MAX_SLIDE_IMAGES = 8;

// Field order matches how the real service page renders, top to bottom:
// Name (hero overlay + page heading) -> Hero Image (hero banner) ->
// Content Title + Description + Content Image (the page's 2nd section,
// title/description/photo side by side) -> Slide Image (a multi-image
// slideshow shown above "Our Promise"). The "Why choose us"/"Our
// process"/"Our promise" sections further down the real page are the same
// on all 3 service pages, so there's no field for them here.
export default function ServiceForm({ existingService, onSuccess, onCancel }) {
  const isEditing = Boolean(existingService);

  const [title, setTitle] = useState(existingService?.title || "");
  const [contentTitle, setContentTitle] = useState(existingService?.contentTitle || "");
  const [intro, setIntro] = useState(existingService?.intro || "");
  const [isActive, setIsActive] = useState(existingService?.isActive ?? true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contentImageFile, setContentImageFile] = useState(null);
  const [contentImagePreview, setContentImagePreview] = useState("");

  const [removedSlidePublicIds, setRemovedSlidePublicIds] = useState([]);
  const [newSlideFiles, setNewSlideFiles] = useState([]);
  const [slideImageWarning, setSlideImageWarning] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cleanup only — no setState here, so this isn't a "derive state from an
  // effect" pattern. The URLs themselves are created in the file inputs'
  // change handlers, event handlers, where side effects are expected.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (contentImagePreview) URL.revokeObjectURL(contentImagePreview);
    };
  }, [imagePreview, contentImagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleContentImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (contentImagePreview) URL.revokeObjectURL(contentImagePreview);
    setContentImageFile(file);
    setContentImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const remainingExistingSlides = useMemo(
    () => (existingService?.slideImages || []).filter((img) => !removedSlidePublicIds.includes(img.publicId)),
    [existingService, removedSlidePublicIds]
  );

  const [newSlidePreviews, setNewSlidePreviews] = useState([]);

  useEffect(() => {
    const previews = newSlideFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewSlidePreviews(previews);
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newSlideFiles]);

  const handleSlideFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const slotsLeft = Math.max(0, MAX_SLIDE_IMAGES - remainingExistingSlides.length);

    if (files.length > slotsLeft) {
      setSlideImageWarning(`Only ${slotsLeft} image${slotsLeft === 1 ? "" : "s"} allowed — extra files were not added.`);
    } else {
      setSlideImageWarning("");
    }

    setNewSlideFiles(files.slice(0, slotsLeft));
    e.target.value = "";
  };

  const removeNewSlide = (fileToRemove) => {
    setNewSlideFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const removeExistingSlide = (publicId) => {
    setRemovedSlidePublicIds((prev) => [...prev, publicId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("contentTitle", contentTitle);
    formData.append("intro", intro);
    if (imageFile) formData.append("image", imageFile);
    if (contentImageFile) formData.append("contentImage", contentImageFile);
    if (isEditing) {
      formData.append("isActive", String(isActive));
      if (removedSlidePublicIds.length > 0) {
        formData.append("removeSlideImagePublicIds", JSON.stringify(removedSlidePublicIds));
      }
    }
    newSlideFiles.forEach((file) => formData.append("slideImages", file));

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

  const currentHeroImageUrl = imagePreview || existingService?.image?.url;
  const currentContentImageUrl = contentImagePreview || existingService?.contentImage?.url;

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

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="service_title" className="text-sm">
          Name
        </label>
        <input
          id="service_title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
        <p className="text-xs text-text-light">Shown as the page heading and over the hero image below.</p>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Hero Image</span>
        {currentHeroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentHeroImageUrl} alt="" className="h-20 w-20 rounded-xs object-cover" />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="text-sm"
        />
        {isEditing && !imageFile && (
          <p className="text-xs text-text-light">Choose a file to replace the current hero image.</p>
        )}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="service_content_title" className="text-sm">
          Section Title
        </label>
        <input
          id="service_content_title"
          type="text"
          value={contentTitle}
          onChange={(e) => setContentTitle(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
        <p className="text-xs text-text-light">Heading shown next to the description and photo below.</p>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="service_intro" className="text-sm">
          Description
        </label>
        <textarea
          id="service_intro"
          rows={4}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Image</span>
        {currentContentImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentContentImageUrl} alt="" className="h-20 w-20 rounded-xs object-cover" />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleContentImageChange}
          className="text-sm"
        />
        {isEditing && !contentImageFile && (
          <p className="text-xs text-text-light">Choose a file to replace the current image.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Slide Image</span>
        <p className="text-xs text-text-light">
          Shown as a slideshow above &quot;Our Promise&quot; on the service page. Add multiple images.
        </p>

        {remainingExistingSlides.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {remainingExistingSlides.map((img) => (
              <div key={img.publicId} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-20 w-20 rounded-xs object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingSlide(img.publicId)}
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
          onChange={handleSlideFilesChange}
          className="text-sm"
        />
        {slideImageWarning && <p className="text-sm text-primary-text">{slideImageWarning}</p>}

        {newSlidePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {newSlidePreviews.map((preview) => (
              <div key={preview.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt="" className="h-20 w-20 rounded-xs object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewSlide(preview.file)}
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
