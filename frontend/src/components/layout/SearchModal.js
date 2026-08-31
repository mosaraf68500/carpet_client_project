"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUI } from "./UIProvider";
import { searchModal } from "@/data/siteContent";
import Logo from "@/components/common/Logo";

export default function SearchModal() {
  const { open, closePanel } = useUI();
  const isOpen = !!open.search;
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" role="dialog" aria-modal="true">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-2xl">{searchModal.heading}</h4>
          <button
            type="button"
            aria-label="Close"
            onClick={() => closePanel("search")}
            className="text-2xl leading-none hover:text-primary"
          >
            ×
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 items-center gap-6 md:grid-cols-[auto_1fr]">
          <Logo className="mx-auto md:mx-0" />

          <form
            role="search"
            className="flex border-b border-black"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchModal.placeholder}
              className="w-full bg-transparent py-3 text-lg focus:outline-none"
            />
            <button type="submit" className="px-4 text-sm uppercase tracking-wide">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-body">
          <span>{searchModal.popularSearchesLabel}</span>
          {searchModal.popularSearches.map((s) => (
            <Link key={s.label} href={s.href} className="underline">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
