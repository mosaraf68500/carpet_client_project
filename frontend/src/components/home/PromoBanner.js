import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { promoBanner, trustBadges } from "@/data/siteContent";

export default function PromoBanner() {
  return (
    <section>
      <Container size="broad" className="my-12.5 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-heading text-2xl sm:text-4xl">{promoBanner.heading}</h2>
          <p className="mt-6 text-body">{promoBanner.description}</p>
          <Button href={promoBanner.cta.href} variant="bottom-line" className="mt-8">
            {promoBanner.cta.label}
          </Button>
        </div>
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <iframe
            src={promoBanner.videoUrl}
            title={promoBanner.heading}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        </div>
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
