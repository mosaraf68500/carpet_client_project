import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
  WhatsAppIcon,
} from "@/components/common/Icons";
import { absoluteUrl } from "@/lib/seo";

// Uses this project's existing inline-SVG icon set (components/common/Icons.js)
// rather than pulling in lucide-react for five icons.
export default function ShareRow({ path, title }) {
  const url = absoluteUrl(path);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer.php?u=${encodedUrl}`, Icon: FacebookIcon },
    { label: "Twitter", href: `https://twitter.com/share?text=${encodedTitle}&url=${encodedUrl}`, Icon: TwitterIcon },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      Icon: LinkedinIcon,
    },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, Icon: MailIcon },
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, Icon: WhatsAppIcon },
  ];

  return (
    <div className="flex items-center gap-4 border-t border-b border-border py-6">
      <span className="font-heading text-sm text-heading">Share:</span>
      <div className="flex items-center gap-3">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center border border-border text-heading transition-colors hover:bg-black hover:text-white"
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}
