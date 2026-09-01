import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { aboutStory } from "@/data/aboutContent";

// The two "Our story" text sections with a mid-page image between them and
// a closing Shop Now CTA, matching the real about-page layout.
export default function AboutCollections() {
  const [firstSection, secondSection] = aboutStory.sections;

  return (
    <Container as="section" size="boxed" className="pb-16 text-center">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-2xl sm:text-3xl">{firstSection.heading}</h2>
        <div className="mt-5 flex flex-col gap-4 text-body">
          {firstSection.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-12 aspect-3/2 w-full max-w-3xl overflow-hidden sm:aspect-video">
        <Image
          src={aboutStory.midImage.image}
          alt={aboutStory.midImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="font-heading text-2xl sm:text-3xl">{secondSection.heading}</h2>
        <div className="mt-5 flex flex-col gap-4 text-body">
          {secondSection.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <Button href={aboutStory.cta.href} variant="outline-dark" className="mt-10">
        {aboutStory.cta.label}
      </Button>
    </Container>
  );
}
