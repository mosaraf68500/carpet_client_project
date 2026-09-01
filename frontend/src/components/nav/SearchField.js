import { SearchIcon } from "@/components/common/Icons";
import { searchField } from "@/data/siteContent";

// Always-visible inline search input (replaces the old icon-triggered popup).
// Plain <input> with no submit handler — focus states are native CSS, so
// this needs no client JS. No real search logic yet; wire up an action once
// a backend exists.
export default function SearchField({ id = "nav-search", className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 border border-border-form bg-white px-4 py-2 transition-colors focus-within:border-black ${className}`}
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-text-light" aria-hidden="true" />
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        name="q"
        placeholder={searchField.placeholder}
        className="w-full bg-transparent text-sm text-black placeholder:text-text-light focus:outline-none"
      />
    </div>
  );
}
