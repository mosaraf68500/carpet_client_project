"use client";

// No real backend to submit to yet — mirrors the pattern already used by
// QuoteForm/ContactForm (preserve the real UI/validation, fake the submit).
// TODO: wire up to a real booking endpoint once one exists.
import { useState } from "react";
import { appointmentForm } from "@/data/appointmentContent";

export default function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p role="status" className="rounded-xs border border-border bg-box-grey px-6 py-8 text-center text-body">
        {appointmentForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="appt_name" className="text-sm">
            {appointmentForm.nameLabel}
          </label>
          <input
            id="appt_name"
            name="name"
            type="text"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="appt_contact" className="text-sm">
            {appointmentForm.contactLabel}
          </label>
          <input
            id="appt_contact"
            name="contact"
            type="text"
            required
            className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:w-1/2 sm:pr-2.5">
        <label htmlFor="appt_date" className="text-sm">
          {appointmentForm.dateLabel}
        </label>
        <input
          id="appt_date"
          name="date"
          type="date"
          required
          className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="appt_message" className="text-sm">
          {appointmentForm.messageLabel}
        </label>
        <textarea
          id="appt_message"
          name="message"
          rows={4}
          className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
      >
        {appointmentForm.submitLabel}
      </button>
    </form>
  );
}
