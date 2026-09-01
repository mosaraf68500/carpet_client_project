"use client";

import { useState } from "react";

// Generic collapsible checkbox-list filter (Size in feet, Size in cm).
// Controlled: `checked` and `onToggle` come from the parent (ShopFiltersProvider)
// so the selection can also drive ProductGrid's filtering, not just this UI.
export default function FilterGroup({ title, items, checkedSet, onToggle, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between font-heading text-base"
      >
        {title}
        <span className="text-text-light">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.label}>
              <label className="flex items-center justify-between gap-2 text-sm text-body hover:text-black">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checkedSet.has(item.label)}
                    onChange={() => onToggle(item.label)}
                    className="h-4 w-4 accent-black"
                  />
                  {item.label}
                </span>
                {item.count != null && (
                  <span className="text-text-lighter">({item.count})</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
