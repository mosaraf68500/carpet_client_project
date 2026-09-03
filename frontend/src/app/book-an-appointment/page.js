import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { appointmentTitleBar, appointmentIntro } from "@/data/appointmentContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book An Appointment | Doha Carpet سجاد الدوحة",
  description: "Book a one-on-one appointment with a Doha Carpet سجاد الدوحة specialist to view pieces in person.",
  path: "/book-an-appointment/",
});

export default function BookAppointmentPage() {
  return (
    <>
      <PageTitleBar heading={appointmentTitleBar.heading} breadcrumb={appointmentTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="font-heading text-2xl">{appointmentIntro.heading}</h2>
          <p className="mt-3 text-body">{appointmentIntro.text}</p>
          <div className="mt-8">
            <AppointmentForm />
          </div>
        </div>
      </Container>
    </>
  );
}
