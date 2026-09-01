"use client";

import { useUI } from "@/components/layout/UIProvider";
import CategoryTree from "./CategoryTree";
import FilterGroup from "./FilterGroup";
import { useShopFilters } from "./ShopFiltersProvider";
import { categoryFilterTree, sizeFtFilter, sizeCmFilter } from "@/data/shopContent";

function FilterContent() {
  const { sizeFt, sizeCm, toggleSizeFt, toggleSizeCm } = useShopFilters();

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-6">
        <h4 className="mb-4 font-heading text-base">Category</h4>
        <CategoryTree tree={categoryFilterTree} />
      </div>
      <FilterGroup title="Size in feet" items={sizeFtFilter} checkedSet={sizeFt} onToggle={toggleSizeFt} />
      <FilterGroup
        title="Size in cm"
        items={sizeCmFilter}
        checkedSet={sizeCm}
        onToggle={toggleSizeCm}
        defaultOpen={false}
      />
    </div>
  );
}

export function FiltersToggleButton() {
  const { openPanel } = useUI();
  return (
    <button
      type="button"
      onClick={() => openPanel("shopFilters")}
      className="flex items-center gap-2 border border-black px-5 py-2.5 text-sm uppercase tracking-wide lg:hidden"
    >
      Filters
    </button>
  );
}

export default function FilterSidebar() {
  const { open, closePanel } = useUI();
  const isOpen = !!open.shopFilters;

  return (
    <>
      {/* Desktop: static column */}
      <aside className="hidden shrink-0 lg:block lg:w-[270px]">
        <h6 className="mb-5 font-heading text-lg uppercase tracking-wide">Filters</h6>
        <FilterContent />
      </aside>

      {/* Mobile / tablet: slide-in panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => closePanel("shopFilters")} />
        <div
          className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h6 className="font-heading text-lg uppercase tracking-wide">Filters</h6>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => closePanel("shopFilters")}
              className="text-xl leading-none"
            >
              ×
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
}
