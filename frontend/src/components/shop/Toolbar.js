import { shopToolbar } from "@/data/shopContent";

// Copy template ("Showing {shown} of {total} results") still comes from
// shopContent.js — that's presentation text, not product data. `total` is
// now the real paginated count from the API, replacing the old hardcoded
// shopToolbar.totalResults value.
export default function Toolbar({ shownCount, total }) {
  const resultText = shopToolbar.resultCountTemplate
    .replace("{shown}", shownCount)
    .replace("{total}", total);

  return (
    <div className="mb-8 border-b border-border pb-6">
      <p className="text-sm text-text-light">{resultText}</p>
    </div>
  );
}
