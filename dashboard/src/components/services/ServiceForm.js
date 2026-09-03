"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createService, updateService } from "@/lib/api";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";

// No real cap on how many slides an editor can add ("as many as they
// want") — this just keeps a sane upper bound rather than being an actual
// intended limit; matches the backend route's multer maxCount.
const MAX_SLIDE_IMAGES = 50;

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

  // Native <input type="file"> is visually hidden (see the "Upload Image"
  // buttons below) — these refs are how the buttons open the real file
  // picker instead of relying on <label htmlFor>, which doesn't play well
  // with the shared Button component's own <button> element.
  const heroImageInputRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const slideImageInputRef = useRef(null);

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

  // Appends to the existing selection rather than replacing it — an editor
  // picking one image, seeing it added, then opening the picker again for
  // another should end up with both, not just the most recent pick.
  const handleSlideFilesChange = (e) => {
    const pickedFiles = Array.from(e.target.files || []);
    const slotsLeft = Math.max(0, MAX_SLIDE_IMAGES - remainingExistingSlides.length - newSlideFiles.length);

    if (pickedFiles.length > slotsLeft) {
      setSlideImageWarning(`Only ${slotsLeft} more image${slotsLeft === 1 ? "" : "s"} allowed — extra files were not added.`);
    } else {
      setSlideImageWarning("");
    }

    setNewSlideFiles((prev) => [...prev, ...pickedFiles.slice(0, slotsLeft)]);
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
          ref={heroImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
        <Button type="button" variant="secondary" className="self-start" onClick={() => heroImageInputRef.current?.click()}>
          Upload Image
        </Button>
        {imageFile && <p className="text-xs text-text-light">Selected: {imageFile.name}</p>}
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
          ref={contentImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleContentImageChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          className="self-start"
          onClick={() => contentImageInputRef.current?.click()}
        >
          Upload Image
        </Button>
        {contentImageFile && <p className="text-xs text-text-light">Selected: {contentImageFile.name}</p>}
        {isEditing && !contentImageFile && (
          <p className="text-xs text-text-light">Choose a file to replace the current image.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm">Slide Image</span>
        <p className="text-xs text-text-light">
          Shown as a slideshow above &quot;Our Promise&quot; on the service page. Add as many as you like — one at a
          time or several at once.
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
          ref={slideImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleSlideFilesChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          className="self-start"
          onClick={() => slideImageInputRef.current?.click()}
        >
          Upload Image
        </Button>
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
