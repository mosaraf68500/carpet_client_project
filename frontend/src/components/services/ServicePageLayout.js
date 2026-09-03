import Image from "next/image";
import Container from "@/components/common/Container";
import ServiceSlideGallery from "./ServiceSlideGallery";

// Generic trust-building copy, intentionally identical on all 3 service
// pages (installation/fixing/delivery) rather than dashboard-controlled —
// matches the reference design's "Why choose us" / "Our promise" sections,
// which the client asked to keep the same everywhere. Lightly reworded from
// the reference (which was written for the Installation page specifically —
// "Professional Installation" as a list item) so the same copy reads
// sensibly on Fixing/Delivery too; the brand name in the reference ("Doha
// Furniture Market") was also corrected to this site's real name.
// "Our Process" used to be a 4th hardcoded item here (OUR_PROCESS) — it's
// now the dashboard-controlled `steps` prop instead, since there's no
// reason each service's actual process should read identically.
const WHY_CHOOSE_US = [
  { title: "Wide Variety of Designs & Colors", text: "Choose from modern, classic, and cultural patterns." },
  { title: "Premium Quality Materials", text: "Long-lasting carpets that resist wear and tear." },
  { title: "Professional Craftsmanship", text: "A skilled team ensures excellent results every time." },
  { title: "Comfort & Elegance", text: "Soft underfoot feel with stylish appeal." },
  { title: "Affordable Pricing", text: "Luxury carpets and service at competitive rates." },
];

const OUR_PROMISE =
  "At Doha Carpet سجاد الدوحة, we don't just sell carpets — we create comfort and elegance for your lifestyle. With our expert care, every carpet will look perfect from day one and stay beautiful for years to come.";

// Shared structure for the 3 /services/[slug] pages, 5 sections:
// 1. Hero image with the service name overlaid.
// 2. Section title + description + a related photo, side by side —
//    dashboard-controlled (contentTitle/intro/contentImage).
// 3. "Why choose us" / "Our process" — static, same on every service page.
// 4. A slideshow gallery (dashboard-controlled, slideImages) — only
//    rendered when at least one slide image exists.
// 5. "Our promise" — static, same on every service page.
// Section 2 only renders when there's real contentTitle/intro text — a
// permanent nav-linked route with no DB record yet (see the 3 page.js
// files' fallback handling) shouldn't show an empty title+description box.
export default function ServicePageLayout({
  title,
  heroImage,
  heroAlt,
  contentTitle,
  intro,
  contentImage,
  contentImageAlt,
  slideImages = [],
  steps = [],
}) {
  const hasContentSection = Boolean(contentTitle || intro);
  const hasSteps = steps.length > 0;

  return (
    <>
      <div className="relative flex h-75 w-full items-center justify-center overflow-hidden sm:h-125">
        <Image src={heroImage} alt={heroAlt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative px-4 text-center font-heading text-3xl text-white sm:text-4xl">{title}</h1>
      </div>

      {hasContentSection && (
        <Container as="section" size="boxed" className="py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              {contentTitle && <h2 className="font-heading text-3xl sm:text-4xl">{contentTitle}</h2>}
              {intro && <p className="mt-6 whitespace-pre-line text-body">{intro}</p>}
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-xs">
              <Image
                src={contentImage}
                alt={contentImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      )}

      <section className="border-y border-border py-16">
        <Container
          size="boxed"
          className={`grid grid-cols-1 gap-10 ${hasSteps ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}
        >
          <div className="rounded-xs bg-box-grey p-8">
            <h2 className="font-heading text-2xl">Why Choose Our Carpet Service?</h2>
            <ul className="mt-6 flex flex-col gap-4 text-body">
              {WHY_CHOOSE_US.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold text-heading">{item.title}</span> – {item.text}
                </li>
              ))}
            </ul>
          </div>
          {hasSteps && (
            <div className="rounded-xs bg-box-grey p-8">
              <h2 className="font-heading text-2xl">Our Process</h2>
              <ol className="mt-6 flex flex-col gap-4 text-body">
                {steps.map((step, i) => (
                  <li key={`${i}-${step.title}`}>
                    <span className="font-semibold text-heading">
                      {i + 1}. {step.title}
                    </span>{" "}
                    – {step.description}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Container>
      </section>

      {slideImages.length > 0 && (
        <Container as="section" size="boxed" className="py-16">
          <ServiceSlideGallery images={slideImages} />
        </Container>
      )}

      <Container size="boxed" className="py-16">
        <div className="rounded-xs bg-box-grey p-8">
          <h2 className="font-heading text-xl">Our Promise</h2>
          <p className="mt-3 text-body">{OUR_PROMISE}</p>
        </div>
      </Container>
    </>
  );
}
