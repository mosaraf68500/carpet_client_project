import PageTitleBar from "@/components/common/PageTitleBar";
import LegalSections from "@/components/legal/LegalSections";
import { privacyContent } from "@/data/legalContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | Doha Furniture أثاث الدوحة",
  description: "How Doha Furniture أثاث الدوحة collects, uses, and protects your information.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageTitleBar heading={privacyContent.titleBar.heading} breadcrumb={privacyContent.titleBar.breadcrumb} />
      <LegalSections updated={privacyContent.updated} sections={privacyContent.sections} />
    </>
  );
}
