"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { createService, updateService } from "@/lib/api";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUpload";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusState";
import ImageUpload from "@/components/common/ImageUpload";

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

  // Backs the public page's "Our Process" section — {title, description}[],
  // optional (an empty array is valid; the backend has no minimum-count
  // requirement). Up/down buttons for reordering rather than drag-and-drop:
  // this project has no drag-and-drop library anywhere, and a handful of
  // steps doesn't need one — buttons are simpler, keyboard-accessible, and
  // add zero new dependencies.
  const [steps, setSteps] = useState(
    existingService?.steps?.length ? existingService.steps.map((s) => ({ ...s })) : []
  );

  const addStep = () => setSteps((prev) => [...prev, { title: "", description: "" }]);

  const updateStep = (index, field, value) =>
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  const removeStep = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

  const moveStep = (index, direction) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const [imageFile, setImageFile] = useState(null);
  const [contentImageFile, setContentImageFile] = useState(null);

  const [removedSlidePublicIds, setRemovedSlidePublicIds] = useState([]);
  const [newSlideFiles, setNewSlideFiles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState("");

  const remainingExistingSlides = useMemo(
    () => (existingService?.slideImages || []).filter((img) => !removedSlidePublicIds.includes(img.publicId)),
    [existingService, removedSlidePublicIds]
  );

  // Appends to the existing selection rather than replacing it — an editor
  // picking one image, seeing it added, then opening the picker again for
  // another should end up with both, not just the most recent pick.
  const addNewSlides = (files) => setNewSlideFiles((prev) => [...prev, ...files]);

  const removeNewSlide = (fileToRemove) => {
    setNewSlideFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const removeExistingSlide = (publicId) => {
    setRemovedSlidePublicIds((prev) => [...prev, publicId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Drop rows the admin added but never finished — the backend requires
    // both title and description on any step that's actually sent.
    const completeSteps = steps.filter((s) => s.title.trim() && s.description.trim());

    // Uploaded together (one XHR each, all in parallel) so the progress bar
    // reflects one combined 0-100 across hero/content/slide images at once,
    // then split back out by the slot each file came from.
    const slots = [
      ...(imageFile ? [{ kind: "image", file: imageFile }] : []),
      ...(contentImageFile ? [{ kind: "contentImage", file: contentImageFile }] : []),
      ...newSlideFiles.map((file) => ({ kind: "slide", file })),
    ];
    const hasUploads = slots.length > 0;

    setSubmitting(true);
    setUploadProgress(hasUploads ? 0 : null);

    try {
      const uploaded = await uploadImagesToCloudinary(
        slots.map((s) => s.file),
        setUploadProgress
      );
      if (hasUploads) setUploadProgress(100);

      const newSlideImages = [];
      let heroImage;
      let sectionImage;
      slots.forEach((slot, i) => {
        if (slot.kind === "image") heroImage = uploaded[i];
        else if (slot.kind === "contentImage") sectionImage = uploaded[i];
        else newSlideImages.push(uploaded[i]);
      });

      const payload = {
        title,
        contentTitle,
        intro,
        steps: completeSteps,
        slideImages: [...remainingExistingSlides, ...newSlideImages],
      };
      if (heroImage) payload.image = heroImage;
      if (sectionImage) payload.contentImage = sectionImage;
      if (isEditing) {
        payload.isActive = isActive;
      }

      if (isEditing) {
        await updateService(existingService._id, payload);
      } else {
        await createService(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save service.");
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

      <div className="md:col-span-2">
        <ImageUpload
          label="Hero Image"
          existingImages={
            !imageFile && existingService?.image?.url
              ? [{ id: existingService.image.publicId, url: existingService.image.url }]
              : []
          }
          newFiles={imageFile ? [imageFile] : []}
          onAddFiles={(files) => setImageFile(files[0])}
          onRemoveNew={() => setImageFile(null)}
          disabled={submitting}
        />
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

      <div className="md:col-span-2">
        <ImageUpload
          label="Image"
          existingImages={
            !contentImageFile && existingService?.contentImage?.url
              ? [{ id: existingService.contentImage.publicId, url: existingService.contentImage.url }]
              : []
          }
          newFiles={contentImageFile ? [contentImageFile] : []}
          onAddFiles={(files) => setContentImageFile(files[0])}
          onRemoveNew={() => setContentImageFile(null)}
          disabled={submitting}
        />
      </div>

      <div className="flex flex-col gap-3 md:col-span-2">
        <span className="text-sm">Steps</span>
        <p className="text-xs text-text-light">
          Shown as the numbered &quot;Our Process&quot; list on the service page. Optional — leave empty to hide that
          list.
        </p>

        {steps.map((step, index) => (
          <div key={index} className="flex gap-3 rounded-xs border border-border-form p-4">
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={() => moveStep(index, -1)}
                disabled={index === 0}
                aria-label="Move step up"
                className="text-text-light hover:text-heading disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => moveStep(index, 1)}
                disabled={index === steps.length - 1}
                aria-label="Move step down"
                className="text-text-light hover:text-heading disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
                placeholder={`Step ${index + 1} title`}
                className="w-full border border-border-form px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
              <textarea
                value={step.description}
                onChange={(e) => updateStep(index, "description", e.target.value)}
                placeholder="Step description"
                rows={2}
                className="w-full border border-border-form px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => removeStep(index)}
              aria-label="Remove step"
              className="self-start text-text-light hover:text-primary-text"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <Button type="button" variant="secondary" className="w-fit" onClick={addStep}>
          <Plus size={16} />
          Add step
        </Button>
      </div>

      <div className="md:col-span-2">
        <ImageUpload
          multiple
          maxFiles={MAX_SLIDE_IMAGES}
          label="Slide Image"
          helperText='Shown as a slideshow above "Our Promise" on the service page. Add as many as you like — one at a time or several at once.'
          existingImages={remainingExistingSlides.map((img) => ({ id: img.publicId, url: img.url }))}
          newFiles={newSlideFiles}
          onAddFiles={addNewSlides}
          onRemoveExisting={removeExistingSlide}
          onRemoveNew={removeNewSlide}
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
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? uploadProgress !== null
              ? uploadProgress < 100
                ? `Uploading… ${uploadProgress}%`
                : "Processing…"
              : "Saving…"
            : isEditing
              ? "Save changes"
              : "Create service"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
