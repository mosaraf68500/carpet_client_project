import Container from "@/components/common/Container";
import { aboutCollections } from "@/data/aboutContent";

// Real extracted copy from the live site's About widget (siteContent.aboutSection),
// walking through each collection — reused here rather than duplicated.
export default function AboutCollections() {
  return (
    <Container as="section" size="boxed" className="py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-body">
        {aboutCollections.map((block, i) => (
          <div key={i}>
            {block.heading && (
              <h3 className="mb-2 font-heading text-xl text-heading">{block.heading}</h3>
            )}
            <p>{block.text}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
