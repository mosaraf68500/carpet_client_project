"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, Pencil } from "lucide-react";

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp";

// Shared image-upload dropzone for every admin form. Picked files are
// uploaded straight to Cloudinary from the browser via
// lib/cloudinaryUpload.js (8MB per file — keep maxSizeMB in sync with the
// Cloudinary upload preset's own limit); this component only manages the
// picked File objects and their previews, not the actual upload. Handles
// click-to-upload, drag-and-drop, size/count validation, preview
// generation for newly-picked files (createObjectURL/revokeObjectURL is
// managed internally so no form has to repeat that bookkeeping), and the
// upload progress bar — one visual language everywhere instead of a bare
// <input type="file"> or a plain "Upload Image" button that doesn't read
// as an upload zone at all.
//
// Single mode (multiple=false, the default): one dropzone that becomes an
// image preview once a file exists, with Change/Remove controls.
// Multi mode: a grid of preview thumbnails (existing + newly-picked, in
// that order) plus a matching "+ Add more" tile, up to maxFiles.
export default function ImageUpload({
  multiple = false,
  maxFiles = multiple ? 8 : 1,
  maxSizeMB = 8,
  accept = DEFAULT_ACCEPT,
  existingImages = [], // [{ id, url }]
  newFiles = [], // File[]
  onAddFiles, // (File[]) => void — already size/count-filtered
  onRemoveExisting, // (id) => void
  onRemoveNew, // (file) => void
  uploadProgress = null, // 0-100, or null when not currently uploading
  disabled = false,
  label,
  helperText,
  // Single-mode instances in this app (category image, service hero/
  // content image) have no backend path to clear an image back to empty —
  // only to replace it — so there's nothing for "remove" to do once a
  // freshly-picked file is un-done back to the saved one. Multi-mode
  // (product images, service slide images) does support removing an
  // existing image — the form just leaves it out of the full images/
  // slideImages array it sends on save — so it defaults on there.
  allowRemoveExisting = multiple,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [warning, setWarning] = useState("");
  const inputRef = useRef(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const [newPreviews, setNewPreviews] = useState([]);
  useEffect(() => {
    const previews = newFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    // Not derivable in render: object URLs are a real browser resource
    // that must be revoked, so creating them has to be tied to an
    // effect's cleanup rather than recomputed (and leaked) on every render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewPreviews(previews);
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newFiles]);

  const totalCount = existingImages.length + newFiles.length;
  const atCapacity = multiple && totalCount >= maxFiles;

  const handleFiles = (fileList) => {
    const picked = Array.from(fileList || []);
    if (picked.length === 0) return;

    const oversized = picked.filter((file) => file.size > maxSizeBytes);
    const withinSize = picked.filter((file) => file.size <= maxSizeBytes);

    const slotsLeft = multiple ? Math.max(0, maxFiles - totalCount) : 1;
    const accepted = withinSize.slice(0, slotsLeft);

    const warnings = [];
    if (oversized.length > 0) {
      warnings.push(
        `${oversized.map((file) => file.name).join(", ")} — over ${maxSizeMB}MB, not added. Compress the image and try again.`
      );
    }
    if (multiple && withinSize.length > slotsLeft) {
      warnings.push(`Only ${slotsLeft} more image${slotsLeft === 1 ? "" : "s"} allowed — extra files were not added.`);
    }
    setWarning(warnings.join(" "));

    if (accepted.length > 0) onAddFiles(accepted);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const dragHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      if (!disabled) setDragActive(true);
    },
    onDragLeave: () => setDragActive(false),
    onDrop: (e) => {
      e.preventDefault();
      setDragActive(false);
      if (!disabled) handleFiles(e.dataTransfer.files);
    },
  };

  const dropzoneClasses = (extra = "") =>
    `flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xs border-2 border-dashed text-center transition-colors ${
      dragActive ? "border-primary bg-primary/5" : "border-border-form bg-box-grey hover:border-text-light"
    } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${extra}`;

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={(e) => {
        handleFiles(e.target.files);
        e.target.value = "";
      }}
      className="hidden"
    />
  );

  const progressBar = uploadProgress !== null && (
    <div className="flex flex-col gap-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-box-grey">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${uploadProgress}%` }} />
      </div>
      <p className="text-xs text-text-light">
        {uploadProgress < 100 ? `Uploading… ${uploadProgress}%` : "Processing…"}
      </p>
    </div>
  );

  const dropzoneHint = (
    <>
      <ImagePlus size={26} className={dragActive ? "text-primary" : "text-text-light"} aria-hidden="true" />
      <p className="text-sm text-body">Click to upload or drag and drop</p>
      <p className="text-xs text-text-light">
        {accept.includes("png") ? "PNG, JPG or WEBP" : "Images"} up to {maxSizeMB}MB
      </p>
    </>
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm">{label}</span>}
      {helperText && <p className="-mt-1 text-xs text-text-light">{helperText}</p>}

      {hiddenInput}

      {!multiple && (
        <div className="w-full max-w-56">
          {existingImages.length === 0 && newPreviews.length === 0 ? (
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onKeyDown={(e) => e.key === "Enter" && openPicker()}
              {...dragHandlers}
              className={dropzoneClasses("h-36 w-full px-4 py-6")}
            >
              {dropzoneHint}
            </div>
          ) : (
            <div className="group relative h-36 w-full overflow-hidden rounded-xs border border-border-form">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newPreviews[0]?.url || existingImages[0]?.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={disabled}
                  aria-label="Change image"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-heading hover:bg-primary hover:text-white"
                >
                  <Pencil size={14} />
                </button>
                {(newPreviews[0] || allowRemoveExisting) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (newPreviews[0]) onRemoveNew(newPreviews[0].file);
                      else if (existingImages[0]) onRemoveExisting(existingImages[0].id);
                    }}
                    disabled={disabled}
                    aria-label="Remove image"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-heading hover:bg-primary hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {multiple && (
        <div className="flex flex-wrap gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xs border border-border-form">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                disabled={disabled}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:bg-primary"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {newPreviews.map((preview) => (
            <div key={preview.url} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xs border border-border-form">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveNew(preview.file)}
                disabled={disabled}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:bg-primary"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {!atCapacity && (
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onKeyDown={(e) => e.key === "Enter" && openPicker()}
              {...dragHandlers}
              className={dropzoneClasses("h-24 w-24 shrink-0 px-2 py-2")}
            >
              <ImagePlus size={20} className={dragActive ? "text-primary" : "text-text-light"} aria-hidden="true" />
              <p className="text-[11px] leading-tight text-text-light">Add image</p>
            </div>
          )}
        </div>
      )}

      {multiple && totalCount === 0 && (
        <p className="text-xs text-text-light">
          {accept.includes("png") ? "PNG, JPG or WEBP" : "Images"} up to {maxSizeMB}MB each, up to {maxFiles} images.
        </p>
      )}

      {warning && <p className="text-sm text-primary-text">{warning}</p>}
      {progressBar}
    </div>
  );
}
