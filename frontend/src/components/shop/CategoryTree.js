"use client";

import { useState } from "react";

function CategoryNode({ node, depth }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <li className={depth > 0 ? "mt-2 pl-4" : "mt-2"}>
      <div className="flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 text-sm text-body hover:text-black">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((v) => !v)}
            className="h-4 w-4 accent-black"
          />
          {node.label}
        </label>
        {hasChildren && (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-5 w-5 items-center justify-center text-text-light hover:text-black"
          >
            {open ? "−" : "+"}
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul>
          {node.children.map((child, i) => (
            <CategoryNode key={`${child.label}-${i}`} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryTree({ tree }) {
  return (
    <ul>
      {tree.map((node, i) => (
        <CategoryNode key={`${node.label}-${i}`} node={node} depth={0} />
      ))}
    </ul>
  );
}
