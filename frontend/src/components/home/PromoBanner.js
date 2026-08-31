import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { promoBanner, trustBadges } from "@/data/siteContent";

export default function PromoBanner() {
  return (
    <section>
      <Container size="broad" className="my-12.5">
        <Link
          href={promoBanner.href}
          className="relative block aspect-video w-full overflow-hidden bg-black"
        >
          <iframe
            src={promoBanner.videoUrl}
            title={promoBanner.heading}
            className="pointer-events-none h-full w-full"
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 px-6 text-center">
            <h2 className="font-heading text-2xl text-white sm:text-4xl">{promoBanner.heading}</h2>
          </div>
        </Link>
      </Container>

      <Container size="boxed" className="grid grid-cols-1 gap-8 py-12.5 text-center sm:grid-cols-3">
        {trustBadges.map((badge) => (
          <div key={badge.title} className="flex flex-col items-center gap-3">
            <Image src={badge.image} alt={`${badge.title} ${badge.subtitle}`} width={56} height={56} />
            <p className="font-heading text-lg">
              {badge.title}
              <br />
              {badge.subtitle}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
