"use client";

// Small client island: only the active-slide state and its arrow/dot
// controls need interactivity, everything else on the page stays server
// rendered. Not reusing ProductGallery (thumbnail strip, no arrows) since
// this needs prev/next arrow buttons and dot pagination instead.
import { useState } from "react";
import Image from "next/image";

export default function ServiceSlideGallery({ images }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const goTo = (index) => setActive((index + images.length) % images.length);

  return (
    <div className="relative">
      <div className="relative aspect-16/9 w-full overflow-hidden sm:aspect-21/9">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${i === active ? "bg-black" : "bg-border"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
