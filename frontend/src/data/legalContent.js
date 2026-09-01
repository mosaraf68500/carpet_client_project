// TODO: placeholder legal copy — standard, generic terms/privacy language
// written to fit this business (handmade rugs, quote-based sales, no live
// checkout), not a real legal document. Have this reviewed by a lawyer
// before it's relied on — replace once the client provides approved copy.
import { brand } from "./siteContent";

export const termsContent = {
  titleBar: {
    heading: "Terms & Conditions",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Terms & Conditions", href: null },
    ],
  },
  updated: "Last updated: September 2026",
  sections: [
    {
      heading: "Introduction",
      body: [
        `Welcome to ${brand.name}. These Terms & Conditions govern your use of our website and any purchase or quote request you make through it. By browsing our site or submitting an enquiry, you agree to these terms.`,
      ],
    },
    {
      heading: "Our Products",
      body: [
        "Every rug, kilim, and textile we offer is handmade or hand-selected, so natural variation in colour, size, and pattern between the product photo and the piece you receive should be expected — this is a feature of handcrafted work, not a defect.",
        "Product images are as accurate as photography allows, but screen colours may differ slightly from the physical piece.",
      ],
    },
    {
      heading: "Quotes, Enquiries & Orders",
      body: [
        "Prices shown on this site are indicative. Because pieces are limited or one-of-a-kind, availability and final pricing are confirmed when you request a quote or contact us directly — not at the point of browsing.",
        "A sale is only confirmed once we've agreed availability, price, and delivery details with you directly, by phone, WhatsApp, or email.",
      ],
    },
    {
      heading: "Intellectual Property",
      body: [
        `All text, images, and design on this site are the property of ${brand.name} or its licensors and may not be reproduced without permission.`,
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        `${brand.name} is not liable for any indirect or consequential loss arising from your use of this website. Nothing in these terms limits liability that cannot be excluded under applicable law.`,
      ],
    },
    {
      heading: "Governing Law",
      body: ["These terms are governed by the laws of Qatar."],
    },
    {
      heading: "Changes to These Terms",
      body: [
        "We may update these terms from time to time. Continued use of the site after changes are posted means you accept the revised terms.",
      ],
    },
  ],
};

export const privacyContent = {
  titleBar: {
    heading: "Privacy Policy",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Privacy Policy", href: null },
    ],
  },
  updated: "Last updated: September 2026",
  sections: [
    {
      heading: "Introduction",
      body: [
        `This policy explains what information ${brand.name} collects when you use this website, and how we use it.`,
      ],
    },
    {
      heading: "Information We Collect",
      body: [
        "Details you give us directly — your name, email, phone number, and message — when you submit a quote request, an appointment request, the contact form, or sign up for our newsletter.",
        "Basic technical information (such as browser type and pages visited) collected automatically to help us understand how the site is used.",
      ],
    },
    {
      heading: "How We Use Your Information",
      body: [
        "To respond to your enquiry, quote request, or appointment request.",
        "To send you our newsletter, if you've subscribed — you can unsubscribe at any time.",
        "To improve our website and the products and services we offer.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This site may use cookies to remember your preferences and understand site usage. You can disable cookies in your browser settings, though some features may not work as intended.",
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We take reasonable steps to protect the information you share with us, but no method of transmission over the internet is completely secure.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        "You can ask us to access, correct, or delete the personal information we hold about you at any time by contacting us using the details below.",
      ],
    },
    {
      heading: "Changes to This Policy",
      body: [
        "We may update this policy from time to time. Any changes will be posted on this page.",
      ],
    },
  ],
};
