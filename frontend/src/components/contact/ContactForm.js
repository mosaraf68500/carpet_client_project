"use client";

// No real backend to submit to yet — mirrors the pattern already used by
// QuoteForm (preserve the real UI/validation, fake the submit).
// TODO: wire up to a real contact endpoint once one exists.
import { useState } from "react";
import { contactForm } from "@/data/contactContent";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p role="status" className="rounded-xs border border-border bg-box-grey px-6 py-8 text-center text-body">
        {contactForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_name" className="text-sm">
            {contactForm.nameLabel}
          </label>
          <input
            id="contact_name"
            name="name"
            type="text"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_email" className="text-sm">
            {contactForm.emailLabel}
          </label>
          <input
            id="contact_email"
            name="email"
            type="email"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact_message" className="text-sm">
          {contactForm.messageLabel}
        </label>
        <textarea
          id="contact_message"
          name="message"
          rows={5}
          required
          placeholder={contactForm.messagePlaceholder}
          className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
      >
        {contactForm.submitLabel}
      </button>
    </form>
  );
}
