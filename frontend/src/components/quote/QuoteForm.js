"use client";

// No real backend to submit to yet — mirrors the pattern already used by
// CartDrawer/AuthModals (preserve the real UI/validation, fake the submit).
// TODO: wire up to the real quote-request endpoint once one exists.
import { useState } from "react";
import { quoteForm } from "@/data/quoteContent";

export default function QuoteForm({ productOptions = [] }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p role="status" className="rounded-xs border border-border bg-box-grey px-6 py-8 text-center text-body">
        {quoteForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_name" className="text-sm">
            {quoteForm.nameLabel}
          </label>
          <input
            id="quote_name"
            name="name"
            type="text"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="quote_email" className="text-sm">
            {quoteForm.emailLabel}
          </label>
          <input
            id="quote_email"
            name="email"
            type="email"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
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
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
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
            placeholder={quoteForm.productPlaceholder}
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
          {productOptions.length > 0 && (
            <datalist id="quote_product_options">
              {productOptions.map((title) => (
                <option key={title} value={title} />
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

      <button
        type="submit"
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
      >
        {quoteForm.submitLabel}
      </button>
    </form>
  );
}
