"use client";

import { useState } from "react";
import { FiltersToggleButton } from "./FilterSidebar";
import { sortOptions, shopToolbar } from "@/data/shopContent";

export default function Toolbar({ shownCount }) {
  const [sort, setSort] = useState(sortOptions[0].value);
  const resultText = shopToolbar.resultCountTemplate
    .replace("{shown}", shownCount)
    .replace("{total}", shopToolbar.totalResults);

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <FiltersToggleButton />
      <p className="text-sm text-text-light">{resultText}</p>
      <label className="ml-auto flex items-center gap-2 text-sm">
        <span className="sr-only">Shop order</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Shop order"
          className="border border-border-form bg-white px-3 py-2 text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
