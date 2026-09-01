import Image from "next/image";
import Container from "@/components/common/Container";
import { aboutHero } from "@/data/aboutContent";

// Large full-width hero image directly under the page title bar, matching
// the real "Our story" page layout.
export default function AboutIntro() {
  return (
    <Container as="section" size="boxed" className="py-16">
      <div className="relative aspect-3/2 w-full overflow-hidden sm:aspect-video">
        <Image
          src={aboutHero.image}
          alt={aboutHero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </Container>
  );
}
