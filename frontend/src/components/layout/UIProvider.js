"use client";

import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(null);

const PANELS = ["mobileMenu", "shopFilters"];

export function UIProvider({ children }) {
  const [open, setOpen] = useState({});

  const openPanel = useCallback((name) => {
    setOpen((prev) => {
      const next = {};
      PANELS.forEach((p) => (next[p] = false));
      next[name] = true;
      return { ...prev, ...next };
    });
  }, []);

  const closePanel = useCallback((name) => {
    setOpen((prev) => ({ ...prev, [name]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setOpen({});
  }, []);

  return (
    <UIContext.Provider value={{ open, openPanel, closePanel, closeAll }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
