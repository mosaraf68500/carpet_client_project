import Link from "next/link";
import Button from "@/components/common/Button";
import { WhatsAppIcon, PhoneIcon, MailIcon } from "@/components/common/Icons";
import { formatSizes } from "@/lib/formatSizes";

// Three CTAs only — no cart, no price-driven checkout. WhatsApp/Call numbers
// come from the Settings API (dashboard-managed) instead of a hardcoded
// number, passed down from the page as `settings` so this stays a plain
// Server Component (no client-side fetch needed).
export default function ProductInfo({ product, settings }) {
  const sizesLabel = formatSizes(product.sizes);

  const whatsappMessage = `Hi, I'm interested in the "${product.title}"${
    sizesLabel ? ` (${sizesLabel})` : ""
  }. Could you share more details?`;
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
  const quoteHref = `/quote/?product=${encodeURIComponent(product.slug)}`;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-2xl sm:text-3xl">{product.title}</h1>

      {product.category && (
        <p className="text-sm text-text-light">
          Category:{" "}
          <Link href={`/product-category/${product.category.slug}/`} className="underline hover:text-black">
            {product.category.name}
          </Link>
        </p>
      )}

      {sizesLabel && <p className="text-sm text-text-light">Size: {sizesLabel}</p>}
      {product.description && <p className="text-body">{product.description}</p>}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={whatsappHref} target="_blank" rel="noopener noreferrer" variant="dark">
          <WhatsAppIcon width={18} height={18} />
          WhatsApp
        </Button>
        <Button href={`tel:+${settings.phone}`} variant="outline-dark">
          <PhoneIcon width={16} height={16} />
          Call Now
        </Button>
        <Button href={quoteHref} variant="outline-dark">
          <MailIcon width={16} height={16} />
          Get a Quote
        </Button>
      </div>
    </div>
  );
}
