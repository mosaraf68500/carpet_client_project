"use client";

import Link from "next/link";
import { footer } from "@/data/siteContent";
import { FacebookIcon, TwitterIcon, InstagramIcon, TikTokIcon } from "@/components/common/Icons";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";

const socialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <Container size="boxed" className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-5">
          <Logo light />
          <h6 className="font-heading text-lg text-white">{footer.newsletter.heading}</h6>
          <form
            className="flex border-b border-white/40"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder={footer.newsletter.placeholder}
              className="w-full bg-transparent py-2 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <button type="submit" className="text-sm uppercase tracking-wide">
              {footer.newsletter.submitLabel}
            </button>
          </form>
          <p className="text-sm text-white/70">
            Got questions?{" "}
            <Link href={footer.contactHref} className="underline">
              Contact Us
            </Link>
          </p>
        </div>

        {footer.columnGroups.map((group, i) => (
          <div key={i} className="flex flex-col gap-8">
            {group.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <h6 className="font-heading text-base text-white">
                  {col.href ? <Link href={col.href}>{col.heading}</Link> : col.heading}
                </h6>
                <ul className="flex flex-col gap-2 text-sm text-white/70">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h6 className="font-heading text-base text-white">{footer.needHelp.heading}</h6>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            <li>
              <a
                href={`https://wa.me/${footer.needHelp.whatsapp.number}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {footer.needHelp.whatsapp.label}: {footer.needHelp.whatsapp.number}
              </a>
            </li>
            <li>
              <a href={`tel:+${footer.needHelp.phone.number}`} className="hover:text-white">
                {footer.needHelp.phone.label}: {footer.needHelp.phone.number}
              </a>
            </li>
            <li>
              <a href={`mailto:${footer.needHelp.email}`} className="hover:text-white">
                {footer.needHelp.email}
              </a>
            </li>
          </ul>
          <ul className="mt-2 flex gap-4">
            {footer.socials.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="hover:text-primary">
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 sm:px-8">
        {footer.copyright}
      </div>
    </footer>
  );
}
