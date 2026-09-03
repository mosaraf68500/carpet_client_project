import Container from "@/components/common/Container";
import { aboutLocation } from "@/data/aboutContent";
import { formatQatarPhone } from "@/lib/formatPhone";

// Store location + embedded map, matching the real about-page layout —
// address/hours/contact on the left, an interactive Google Map on the
// right. Uses Google's keyless "?q=...&output=embed" iframe form since no
// Maps API key is configured for this project.
export default function AboutLocation() {
  const { lat, lng } = aboutLocation.mapCoords;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=${aboutLocation.mapZoom}&output=embed`;
  const phoneDisplay = formatQatarPhone(aboutLocation.phone);

  return (
    <Container as="section" size="boxed" className="pb-16">
      <h2 className="font-heading text-2xl sm:text-3xl">{aboutLocation.heading}</h2>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-heading text-base">Address</h3>
            <p className="mt-2 text-sm text-body">
              {aboutLocation.address.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div>
            <h3 className="font-heading text-base">Store timings</h3>
            <p className="mt-2 text-sm text-body">
              {aboutLocation.storeTimings.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div>
            <h3 className="font-heading text-base">Call us</h3>
            <p className="mt-2 text-sm text-body">
              <a href={`tel:+${aboutLocation.phone}`} className="hover:text-primary">
                {phoneDisplay}
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-heading text-base">Email us</h3>
            <p className="mt-2 text-sm text-body">
              <a href={`mailto:${aboutLocation.email}`} className="hover:text-primary">
                {aboutLocation.email}
              </a>
            </p>
          </div>
        </div>

        <div className="aspect-3/2 w-full overflow-hidden sm:aspect-video">
          <iframe
            src={mapSrc}
            title={`Map to Doha Carpet سجاد الدوحة — ${aboutLocation.heading}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Container>
  );
}
