"use client";

import { useState } from "react";
import { quoteForm } from "@/data/quoteContent";
import { submitContact } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// productOptions: [{ id, title }] — real products, used both for the
// free-text field's autocomplete list and to resolve a typed/selected
// title back to a real product _id at submit time (see handleSubmit).
export default function QuoteForm({ productOptions = [], initialProduct = "" }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const productText = formData.get("product")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    // Required per the backend (contact.service.ts's createMessage): name,
    // phone, and email all 400 if missing. Validated here (not just left to
    // native `required`) so the messaging is consistent and visible rather
    // than relying on the browser's own validation UI.
    const errors = {};
    if (!name) errors.name = quoteForm.nameRequiredError;
    if (!phone) errors.phone = quoteForm.phoneRequiredError;
    if (!email) errors.email = quoteForm.emailRequiredError;
    else if (!EMAIL_PATTERN.test(email)) errors.email = quoteForm.emailInvalidError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    // The backend's `productId` field only accepts a real Product _id
    // (contact.service.ts's createMessage does ProductModel.findById) — a
    // slug or arbitrary typed title can't go there directly, and there's no
    // separate "product name" field on the backend. So: an exact match
    // against a known product's title (from productOptions, which always
    // includes the ?product=slug prefill's own product — see quote/page.js)
    // resolves to a real productId; anything else instead gets folded into
    // the free-text message so the info isn't silently dropped.
    const matchedProduct = productOptions.find((p) => p.title === productText);
    const finalMessage =
      productText && !matchedProduct ? `Product of interest: ${productText}\n\n${message}` : message;

    try {
      await submitContact(
        {
          name,
          phone,
          email,
          message: finalMessage,
          ...(matchedProduct ? { productId: matchedProduct.id } : {}),
        },
        "quote"
      );
      setStatus("success");
    } catch {
      // Deliberately don't reset the form on failure — the user's typed
      // info must survive so they don't have to retype everything. Since
      // the form stays mounted (only the success state swaps it out), the
      // uncontrolled inputs below keep their values automatically.
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p role="status" className="rounded-xs border border-border bg-box-grey px-6 py-8 text-center text-body">
        {quoteForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_name" className="text-sm">
            {quoteForm.nameLabel}
          </label>
          <input
            id="quote_name"
            name="name"
            type="text"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "quote_name_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.name ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.name && (
            <p id="quote_name_error" className="text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_email" className="text-sm">
            {quoteForm.emailLabel}
          </label>
          <input
            id="quote_email"
            name="email"
            type="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "quote_email_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.email ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.email && (
            <p id="quote_email_error" className="text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_phone" className="text-sm">
            {quoteForm.phoneLabel}
          </label>
          <input
            id="quote_phone"
            name="phone"
            type="tel"
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "quote_phone_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.phone ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.phone && (
            <p id="quote_phone_error" className="text-xs text-red-600">
              {fieldErrors.phone}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_product" className="text-sm">
            {quoteForm.productLabel}
          </label>
          <input
            id="quote_product"
            name="product"
            type="text"
            list="quote_product_options"
            defaultValue={initialProduct}
            placeholder={quoteForm.productPlaceholder}
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
          {productOptions.length > 0 && (
            <datalist id="quote_product_options">
              {productOptions.map((p) => (
                <option key={p.id} value={p.title} />
              ))}
            </datalist>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="quote_message" className="text-sm">
          {quoteForm.messageLabel}
        </label>
        <textarea
          id="quote_message"
          name="message"
          rows={5}
          placeholder={quoteForm.messagePlaceholder}
          className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {quoteForm.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : quoteForm.submitLabel}
      </button>
    </form>
  );
}
