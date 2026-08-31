// Renders a JSON-LD <script> tag. `data` must already be a plain, serializable
// object built from a trusted source (our own seo.js helpers) — never pass
// unsanitized user input here.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
