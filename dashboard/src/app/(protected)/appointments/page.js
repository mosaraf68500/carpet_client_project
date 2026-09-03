"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { getAppointments, updateAppointmentStatus, deleteAppointment } from "@/lib/api";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

// Color-coded per status so the table is scannable at a glance.
const STATUS_BADGE_CLASSES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-accent-green/10 text-accent-green",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-primary/10 text-primary-text",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { dateStyle: "medium" });
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  // Used by event handlers (pagination) — safe to call by reference there
  // since it's never invoked directly from an effect body.
  const loadAppointments = useCallback(async (pageToLoad) => {
    try {
      const result = await getAppointments({ page: pageToLoad, limit: PAGE_SIZE });
      setAppointments(result.items);
      setTotalPages(result.totalPages);
      setPage(result.page);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Failed to load appointments.");
      setStatus("error");
    }
  }, []);

  // Fetches inline (rather than calling loadAppointments by reference) so
  // every state update stays inside a .then()/.catch() callback, not the
  // effect's own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getAppointments({ page: 1, limit: PAGE_SIZE }).then(
      (result) => {
        if (cancelled) return;
        setAppointments(result.items);
        setTotalPages(result.totalPages);
        setPage(result.page);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load appointments.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (appointment, nextStatus) => {
    const previous = appointment.status;
    setAppointments((prev) =>
      prev.map((a) => (a._id === appointment._id ? { ...a, status: nextStatus } : a))
    );
    try {
      await updateAppointmentStatus(appointment._id, nextStatus);
    } catch (err) {
      // Revert on failure — the badge shouldn't lie about what the backend has.
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointment._id ? { ...a, status: previous } : a))
      );
      window.alert(err.message || "Failed to update status.");
    }
  };

  const handleDelete = async (appointment) => {
    if (!window.confirm(`Delete the appointment request from "${appointment.name}"? This cannot be undone.`))
      return;
    try {
      await deleteAppointment(appointment._id);
      setAppointments((prev) => prev.filter((a) => a._id !== appointment._id));
    } catch (err) {
      window.alert(err.message || "Failed to delete appointment.");
    }
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setStatus("loading");
    setError("");
    loadAppointments(nextPage);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-heading">Appointments</h1>

      {status === "loading" && <LoadingState message="Loading appointments…" />}

      {status === "error" && <ErrorState message={error} />}

      {status === "ready" && appointments.length === 0 && (
        <EmptyState icon={CalendarCheck} message="No appointment requests yet." />
      )}

      {status === "ready" && appointments.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xs border border-border bg-white">
            <table className="w-full min-w-180 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-box-grey text-xs uppercase tracking-wide text-text-light">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Preferred Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-heading">{appointment.name}</td>
                    <td className="px-4 py-3 text-body">{appointment.contact}</td>
                    <td className="px-4 py-3 text-body">{formatDate(appointment.preferredDate)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment, e.target.value)}
                        className={`rounded-xs border-0 px-2 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-1 focus:ring-black ${
                          STATUS_BADGE_CLASSES[appointment.status] || "bg-box-grey text-text-light"
                        }`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-light">{formatDateTime(appointment.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button variant="linkDanger" onClick={() => handleDelete(appointment)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-sm text-body hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-body">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm text-body hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
