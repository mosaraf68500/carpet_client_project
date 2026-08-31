import Image from "next/image";
import Container from "@/components/common/Container";
import { partnerLogos } from "@/data/siteContent";

// In the source markup this "as featured in" strip is page content (sits right
// before the footer), not part of the shared footer template — kept as its own
// section so it doesn't leak onto other pages that reuse <Footer />.
export default function PressLogos() {
  return (
    <section className="border-t border-border bg-white py-10">
      <Container size="boxed" className="flex flex-wrap items-center justify-center gap-10">
        {partnerLogos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={140}
            height={37}
            className="h-9 w-auto object-contain"
          />
        ))}
      </Container>
    </section>
  );
}
