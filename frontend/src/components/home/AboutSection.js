import Button from "@/components/common/Button";
import { aboutSection } from "@/data/siteContent";

export default function AboutSection() {
  return (
    <section className="bg-cream px-4 py-12.5 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl sm:text-4xl">{aboutSection.heading}</h2>
        <p className="mt-6 text-lg text-body">{aboutSection.intro}</p>
        <p className="mt-4 text-body">{aboutSection.introContinued}</p>
        <Button href={aboutSection.cta.href} variant="dark" className="mt-8">
          {aboutSection.cta.label}
        </Button>
      </div>

      <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-6 text-body">
        {aboutSection.body.map((block, i) => (
          <div key={i}>
            {block.heading && (
              <h3 className="mb-2 font-heading text-xl text-heading">{block.heading}</h3>
            )}
            <p>{block.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
