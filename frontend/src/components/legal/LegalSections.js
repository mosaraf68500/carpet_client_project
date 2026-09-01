import Container from "@/components/common/Container";

// Shared renderer for Terms & Conditions / Privacy Policy — same heading +
// paragraph-list shape, so the two pages don't duplicate this markup.
export default function LegalSections({ updated, sections }) {
  return (
    <Container size="boxed" className="py-14">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <p className="text-sm text-text-light">{updated}</p>
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-heading text-xl text-accent-green">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-3 text-body">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
