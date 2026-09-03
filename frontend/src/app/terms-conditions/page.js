import PageTitleBar from "@/components/common/PageTitleBar";
import LegalSections from "@/components/legal/LegalSections";
import { termsContent } from "@/data/legalContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms & Conditions | Doha Carpet سجاد الدوحة",
  description: "The terms and conditions for using Doha Carpet سجاد الدوحة's website and services.",
  path: "/terms-conditions/",
});

export default function TermsConditionsPage() {
  return (
    <>
      <PageTitleBar heading={termsContent.titleBar.heading} breadcrumb={termsContent.titleBar.breadcrumb} />
      <LegalSections updated={termsContent.updated} sections={termsContent.sections} />
    </>
  );
}
