import { WhatsAppIcon, PhoneIcon } from "@/components/common/Icons";
import { footer } from "@/data/siteContent";

// Fixed contact shortcuts pinned to the right edge, vertically centered —
// same phone/WhatsApp number already used in the footer's "Need Help?" block.
export default function FloatingContactButtons() {
  const { whatsapp, phone } = footer.needHelp;

  return (
    <div className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-4 sm:right-6">
      <a
        href={`https://wa.me/${whatsapp.number}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsapp.label}
        className="relative flex h-12 w-12 items-center justify-center"
      >
        <span className="animate-ripple-wave absolute inset-0 rounded-full bg-[#25D366]" />
        <span
          className="animate-ripple-wave absolute inset-0 rounded-full bg-[#25D366]"
          style={{ animationDelay: "1s" }}
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110">
          <WhatsAppIcon />
        </span>
      </a>
      <a
        href={`tel:+${phone.number}`}
        aria-label={phone.label}
        className="relative flex h-12 w-12 items-center justify-center"
      >
        <span className="animate-ripple-wave absolute inset-0 rounded-full bg-primary" />
        <span
          className="animate-ripple-wave absolute inset-0 rounded-full bg-primary"
          style={{ animationDelay: "1s" }}
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110">
          <PhoneIcon />
        </span>
      </a>
    </div>
  );
}
