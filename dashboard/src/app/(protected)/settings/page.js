"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, SuccessState } from "@/components/ui/StatusState";

export default function SettingsPage() {
  const [form, setForm] = useState({ phone: "", landline: "", whatsapp: "", email: "", address: "" });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [saved, setSaved] = useState(false);

  // Fetches inline (rather than delegating to a by-reference function) so
  // every state update stays inside a .then()/.catch() callback, not the
  // effect's own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getSettings().then(
      (result) => {
        if (cancelled) return;
        setForm({
          phone: result.phone || "",
          landline: result.landline || "",
          whatsapp: result.whatsapp || "",
          email: result.email || "",
          address: result.address || "",
        });
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load settings.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // The setState call here runs inside the setTimeout callback, not
  // synchronously in the effect body, so it's outside what
  // react-hooks/set-state-in-effect restricts.
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSaved(false);
    setSubmitting(true);
    try {
      await updateSettings(form);
      setSaved(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to save settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-heading">Settings</h1>

      {status === "loading" && <LoadingState message="Loading settings…" />}

      {status === "error" && <ErrorState message={error} />}

      {status === "ready" && (
        <form
          onSubmit={handleSubmit}
          className="grid w-full max-w-3xl grid-cols-1 gap-6 rounded-xs border border-border bg-white p-6 md:grid-cols-2"
        >
          {submitError && (
            <div className="md:col-span-2">
              <ErrorState message={submitError} />
            </div>
          )}

          {saved && (
            <div className="md:col-span-2">
              <SuccessState message="Saved." />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="settings_phone" className="text-sm">
              Phone
            </label>
            <input
              id="settings_phone"
              type="text"
              value={form.phone}
              onChange={handleChange("phone")}
              className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="settings_landline" className="text-sm">
              Landline
            </label>
            <input
              id="settings_landline"
              type="text"
              value={form.landline}
              onChange={handleChange("landline")}
              className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="settings_whatsapp" className="text-sm">
              WhatsApp
            </label>
            <input
              id="settings_whatsapp"
              type="text"
              value={form.whatsapp}
              onChange={handleChange("whatsapp")}
              placeholder="e.g. 97412345678"
              className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
            <p className="text-xs text-text-light">Digits only, no spaces or symbols — used to build wa.me links.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="settings_email" className="text-sm">
              Email
            </label>
            <input
              id="settings_email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="settings_address" className="text-sm">
              Address
            </label>
            <textarea
              id="settings_address"
              rows={3}
              value={form.address}
              onChange={handleChange("address")}
              className="w-full border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
