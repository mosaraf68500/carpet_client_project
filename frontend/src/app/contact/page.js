import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import ContactForm from "@/components/contact/ContactForm";
import { contactTitleBar, contactIntro } from "@/data/contactContent";
import { footer } from "@/data/siteContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us | Doha Carpet سجاد الدوحة",
  description: "Get in touch with Doha Carpet سجاد الدوحة by WhatsApp, phone, email, or the contact form below.",
  path: "/contact/",
});

export default function ContactPage() {
  const { needHelp } = footer;

  return (
    <>
      <PageTitleBar heading={contactTitleBar.heading} breadcrumb={contactTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-heading text-2xl">{contactIntro.heading}</h2>
            <p className="mt-3 text-body">{contactIntro.text}</p>

            <dl className="mt-8 flex flex-col gap-4 text-sm text-body">
              <div>
                <dt className="font-medium text-heading">{needHelp.whatsapp.label}</dt>
                <dd>
                  <a
                    href={`https://wa.me/${needHelp.whatsapp.number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary"
                  >
                    {needHelp.whatsapp.number}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-heading">{needHelp.phone.label}</dt>
                <dd>
                  <a href={`tel:+${needHelp.phone.number}`} className="hover:text-primary">
                    {needHelp.phone.number}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-heading">Email</dt>
                <dd>
                  <a href={`mailto:${needHelp.email}`} className="hover:text-primary">
                    {needHelp.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </Container>
    </>
  );
}
