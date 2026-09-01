import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { aboutShowroom } from "@/data/aboutContent";

// TODO: replace with real design once client provides it — intro copy is
// placeholder filler; phone/email are the real values already defined in
// data/siteContent.js (footer.needHelp), reused rather than invented.
export default function AboutShowroom() {
  return (
    <Container as="section" size="boxed" className="py-16 text-center">
      <h2 className="font-heading text-3xl">{aboutShowroom.heading}</h2>
      <p className="mx-auto mt-4 max-w-xl text-body">{aboutShowroom.text}</p>
      <dl className="mt-6 flex flex-col items-center gap-1 text-sm text-body">
        <div className="flex gap-2">
          <dt className="font-medium">Phone:</dt>
          <dd>
            <a href={`tel:+${aboutShowroom.phone}`} className="hover:text-primary">
              {aboutShowroom.phone}
            </a>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Email:</dt>
          <dd>
            <a href={`mailto:${aboutShowroom.email}`} className="hover:text-primary">
              {aboutShowroom.email}
            </a>
          </dd>
        </div>
      </dl>
      <Button href={aboutShowroom.cta.href} variant="dark" className="mt-8">
        {aboutShowroom.cta.label}
      </Button>
    </Container>
  );
}
