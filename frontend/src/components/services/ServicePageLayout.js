import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import PageTitleBar from "@/components/common/PageTitleBar";

// Shared structure for the 3 /services/[slug] pages: standard title bar,
// centered intro blurb, a full-bleed hero image with an overlapping caption
// card, 4 alternating image/text rows, then a CTA banner. Each page just
// passes in its own `service` object from data/servicesContent.js — nothing
// here is service-specific, so the 3 pages stay visually identical and only
// the content differs.
export default function ServicePageLayout({ service }) {
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Services", href: null },
    { label: service.breadcrumbLabel, href: null },
  ];

  return (
    <>
      <PageTitleBar heading={service.name} breadcrumb={breadcrumb} />

      <Container as="section" size="boxed" className="pt-16 pb-10 text-center">
        <div className="mx-auto max-w-182.5">
          <h2 className="font-heading text-2xl sm:text-3xl">{service.introHeading}</h2>
          <p className="mt-4 text-body">{service.introText}</p>
        </div>
      </Container>

      <section className="relative">
        <div className="relative h-125 w-full overflow-hidden">
          <Image
            src={service.heroImage}
            alt={service.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto -mt-14 w-[90%] max-w-xl bg-cream px-8 py-6 text-center shadow-lg sm:-mt-16">
          <h3 className="font-heading text-xl sm:text-2xl">{service.heroCaption}</h3>
        </div>
      </section>

      <div className="pt-10">
        {service.rows.map((row, i) => {
          const imageRight = i % 2 === 0;
          return (
            <div key={row.title} className="grid grid-cols-1 lg:grid-cols-2">
              <div
                className={`flex items-center px-6 py-12 sm:px-12 lg:px-16 lg:py-16 ${
                  imageRight ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="max-w-125">
                  <h3 className="font-heading text-2xl">{row.title}</h3>
                  <p className="mt-4 text-body">{row.text}</p>
                </div>
              </div>
              <div
                className={`relative h-80 lg:h-auto ${imageRight ? "lg:order-2" : "lg:order-1"}`}
              >
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-cream py-16 text-center">
        <Container size="boxed">
          <h2 className="font-heading text-2xl sm:text-3xl">{service.ctaHeading}</h2>
          <p className="mx-auto mt-3 max-w-md text-body">{service.ctaText}</p>
          <Button href="/quote/" variant="outline-dark" className="mt-8">
            Get a Free Quote
          </Button>
        </Container>
      </section>
    </>
  );
}
