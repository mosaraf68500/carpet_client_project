"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { heroSlides } from "@/data/siteContent";

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Auto-rotating carousels are exactly the motion prefers-reduced-motion
    // is meant to suppress — leave the first slide showing and let visitors
    // navigate manually via the dots instead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden sm:h-[85vh]">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.imageDesktop}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="hidden object-cover sm:block"
          />
          <Image
            src={slide.imageMobile}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="block object-cover sm:hidden"
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h3 className="font-display max-w-3xl text-4xl leading-tight text-white sm:text-6xl">
              {slide.title}
            </h3>
            {slide.subtitle && (
              <p className="mt-4 max-w-xl font-heading text-lg text-white sm:text-2xl">
                {slide.subtitle}
              </p>
            )}
            <Button href={slide.cta.href} variant="border" className="mt-8">
              {slide.cta.label}
            </Button>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === active ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
