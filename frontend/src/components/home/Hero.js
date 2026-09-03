"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import { heroSlides } from "@/data/siteContent";

export default function Hero() {
  const [active, setActive] = useState(0);
  const activeSlide = heroSlides[active];

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
    <section className="relative h-125 w-full overflow-hidden sm:h-150">
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
        </div>
      ))}

      {/* Text/button reflect only the active slide, in one block re-keyed
          by `active` so the fade-up entrance replays on every slide
          change (auto-rotate or a dot click), not just on first mount.
          Wrapped in the same Container size="header" the Navbar uses for
          its logo, so the left edge lines up exactly instead of using a
          separate padding value that only coincidentally matched it. */}
      <div className="relative flex h-full flex-col justify-center text-white">
        <Container size="header" className="flex flex-col items-start text-left">
          <div key={active} className="animate-hero-fade-up flex flex-col items-start">
            <h3 className="font-display max-w-3xl text-4xl leading-tight text-white sm:text-6xl">
              {activeSlide.title}
            </h3>
            {activeSlide.subtitle && (
              <p className="mt-4 max-w-xl font-heading text-lg text-white sm:text-2xl">
                {activeSlide.subtitle}
              </p>
            )}
            <Button href={activeSlide.cta.href} variant="light" className="mt-8 normal-case!">
              {activeSlide.cta.label}
            </Button>
          </div>
        </Container>
      </div>

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
