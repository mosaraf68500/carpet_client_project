// The dashboard's product form (ProductForm.js) lets an admin freely
// "+ Add size" / "Remove" generic value+unit rows with no "length"/"width"
// labels — the shape of a list of AVAILABLE SIZE OPTIONS a buyer can choose
// from (e.g. a rug sold in 6ft, 8ft, and 10ft versions), not a fixed
// [length, width] dimension pair (which would be exactly two required,
// labeled fields with no add/remove UI). Formatted accordingly below.
export function formatSizes(sizes) {
  if (!sizes || sizes.length === 0) return null;
  return `${sizes.map((s) => `${s.value} ${s.unit}`).join(", ")} available`;
}
