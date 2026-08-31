"use client";

// Small client island: only the active-image toggle needs interactivity.
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, title }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-box-grey">
        <Image
          src={gallery[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${i + 1} of ${title}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden border ${
                i === active ? "border-black" : "border-border"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
