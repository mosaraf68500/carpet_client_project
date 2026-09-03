"use client";

import { useState } from "react";
import { contactForm } from "@/data/contactContent";
import { submitContact } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    // Required per the backend (contact.service.ts's createMessage): name,
    // phone, and email all 400 if missing.
    const errors = {};
    if (!name) errors.name = contactForm.nameRequiredError;
    if (!phone) errors.phone = contactForm.phoneRequiredError;
    if (!email) errors.email = contactForm.emailRequiredError;
    else if (!EMAIL_PATTERN.test(email)) errors.email = contactForm.emailInvalidError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    try {
      await submitContact({ name, phone, email, message });
      setStatus("success");
    } catch {
      // Don't reset the form on failure — the user's typed info must
      // survive so they don't have to retype everything.
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p role="status" className="rounded-xs border border-border bg-box-grey px-6 py-8 text-center text-body">
        {contactForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_name" className="text-sm">
            {contactForm.nameLabel}
          </label>
          <input
            id="contact_name"
            name="name"
            type="text"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "contact_name_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.name ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.name && (
            <p id="contact_name_error" className="text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_email" className="text-sm">
            {contactForm.emailLabel}
          </label>
          <input
            id="contact_email"
            name="email"
            type="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "contact_email_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.email ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.email && (
            <p id="contact_email_error" className="text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:w-1/2 sm:pr-2.5">
        <label htmlFor="contact_phone" className="text-sm">
          {contactForm.phoneLabel}
        </label>
        <input
          id="contact_phone"
          name="phone"
          type="tel"
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "contact_phone_error" : undefined}
          className={`border px-3 py-2 focus:outline-none ${
            fieldErrors.phone ? "border-red-500" : "border-border-form focus:border-black"
          }`}
        />
        {fieldErrors.phone && (
          <p id="contact_phone_error" className="text-xs text-red-600">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact_message" className="text-sm">
          {contactForm.messageLabel}
        </label>
        <textarea
          id="contact_message"
          name="message"
          rows={5}
          placeholder={contactForm.messagePlaceholder}
          className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {contactForm.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : contactForm.submitLabel}
      </button>
    </form>
  );
}
