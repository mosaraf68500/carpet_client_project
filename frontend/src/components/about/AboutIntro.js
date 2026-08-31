import Image from "next/image";
import Container from "@/components/common/Container";
import { aboutIntro } from "@/data/aboutContent";

export default function AboutIntro() {
  return (
    <Container as="section" size="boxed" className="py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={aboutIntro.image}
            alt={aboutIntro.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading text-3xl">{aboutIntro.heading}</h2>
          <div className="mt-5 flex flex-col gap-4 text-body">
            {aboutIntro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
