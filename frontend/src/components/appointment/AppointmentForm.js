"use client";

import { useState } from "react";
import { appointmentForm } from "@/data/appointmentContent";
import { submitAppointment } from "@/lib/api";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TODAY = getTodayDateString();

export default function AppointmentForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const contact = formData.get("contact")?.toString().trim() || "";
    const date = formData.get("date")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    // Required per the backend (appointment.service.ts's createAppointment):
    // name, contact, and preferredDate all 400 if missing.
    const errors = {};
    if (!name) errors.name = appointmentForm.nameRequiredError;
    if (!contact) errors.contact = appointmentForm.contactRequiredError;
    if (!date) errors.date = appointmentForm.dateRequiredError;
    // String comparison works here since both sides are fixed-width
    // YYYY-MM-DD — catches a past date typed/pasted around the native
    // date picker's own min-attribute enforcement.
    else if (date < TODAY) errors.date = appointmentForm.datePastError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    try {
      await submitAppointment({ name, contact, preferredDate: date, message });
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
        {appointmentForm.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="appt_name" className="text-sm">
            {appointmentForm.nameLabel}
          </label>
          <input
            id="appt_name"
            name="name"
            type="text"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "appt_name_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.name ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.name && (
            <p id="appt_name_error" className="text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="appt_contact" className="text-sm">
            {appointmentForm.contactLabel}
          </label>
          <input
            id="appt_contact"
            name="contact"
            type="text"
            aria-invalid={!!fieldErrors.contact}
            aria-describedby={fieldErrors.contact ? "appt_contact_error" : undefined}
            className={`border px-3 py-2 focus:outline-none ${
              fieldErrors.contact ? "border-red-500" : "border-border-form focus:border-black"
            }`}
          />
          {fieldErrors.contact && (
            <p id="appt_contact_error" className="text-xs text-red-600">
              {fieldErrors.contact}
            </p>
          )}
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
          min={TODAY}
          aria-invalid={!!fieldErrors.date}
          aria-describedby={fieldErrors.date ? "appt_date_error" : undefined}
          className={`border px-3 py-2 focus:outline-none ${
            fieldErrors.date ? "border-red-500" : "border-border-form focus:border-black"
          }`}
        />
        {fieldErrors.date && (
          <p id="appt_date_error" className="text-xs text-red-600">
            {fieldErrors.date}
          </p>
        )}
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

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {appointmentForm.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 self-start bg-black px-8 py-3 text-sm uppercase tracking-wide text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : appointmentForm.submitLabel}
      </button>
    </form>
  );
}
