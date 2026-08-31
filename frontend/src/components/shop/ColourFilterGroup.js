"use client";

import { useState } from "react";

// The source site uses small uploaded swatch photos per colour; those specific
// image assets weren't available to copy, so real CSS swatches (mapped from the
// same colour names/counts) stand in for them here.
const SWATCH_COLORS = {
  Violet: "#8f5fbf",
  Yellow: "#e8c547",
  Orange: "#d97b3f",
  Red: "#b23b3b",
  Pink: "#e0a6b8",
  Blue: "#3f5f8f",
  Green: "#5f7a4f",
  Brown: "#6b4a34",
  "Beige, Off White": "#e6ddc8",
  "Silver, Grey": "#a8a8a8",
  White: "#ffffff",
  Black: "#1a1a1a",
  Multi: "conic-gradient(from 0deg, #b23b3b, #e8c547, #5f7a4f, #3f5f8f, #8f5fbf, #b23b3b)",
};

export default function ColourFilterGroup({ title, items }) {
  const [open, setOpen] = useState(true);
  const [checkedSet, setCheckedSet] = useState(() => new Set());

  const toggle = (label) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

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
        <div className="mt-4 grid grid-cols-4 gap-3">
          {items.map((item) => {
            const active = checkedSet.has(item.label);
            const bg = SWATCH_COLORS[item.label] || "#cccccc";
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => toggle(item.label)}
                title={`${item.label} (${item.count ?? 0})`}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`h-8 w-8 rounded-full border ${
                    active ? "ring-2 ring-black ring-offset-2" : "border-border"
                  }`}
                  style={{ background: bg }}
                />
                <span className="text-center text-[11px] leading-tight text-text-light">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
