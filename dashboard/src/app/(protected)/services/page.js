"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { getAdminServices, deleteService } from "@/lib/api";
import ServiceForm from "@/components/services/ServiceForm";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Used by event handlers (post-save refresh) — safe to call by reference
  // there since it's never invoked directly from an effect body.
  const refresh = () => {
    setStatus("loading");
    setError("");
    getAdminServices().then(
      (result) => {
        setServices(result);
        setStatus("ready");
      },
      (err) => {
        setError(err.message || "Failed to load services.");
        setStatus("error");
      }
    );
  };

  // Fetches inline (rather than calling refresh by reference) so every
  // state update stays inside a .then()/.catch() callback, not the effect's
  // own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getAdminServices().then(
      (result) => {
        if (cancelled) return;
        setServices(result);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load services.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.title}"? This cannot be undone.`)) return;
    try {
      await deleteService(service._id);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch (err) {
      window.alert(err.message || "Failed to delete service.");
    }
  };

  const handleAddClick = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingService(null);
    refresh();
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingService(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-heading">Services</h1>
        {!formOpen && (
          <Button variant="primary" onClick={handleAddClick}>
            + Add Service
          </Button>
        )}
      </div>

      {formOpen && (
        <ServiceForm existingService={editingService} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}

      {!formOpen && status === "loading" && <LoadingState message="Loading services…" />}

      {!formOpen && status === "error" && <ErrorState message={error} />}

      {!formOpen && status === "ready" && services.length === 0 && (
        <EmptyState icon={Wrench} message="No services yet — add your first one below." />
      )}

      {!formOpen && status === "ready" && services.length > 0 && (
        <div className="overflow-x-auto rounded-xs border border-border bg-white">
          <table className="w-full min-w-180 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-box-grey text-xs uppercase tracking-wide text-text-light">
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Steps</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    {service.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={service.image.url} alt="" className="h-12 w-12 rounded-xs object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-xs bg-box-grey" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-heading">{service.title}</td>
                  <td className="px-4 py-3 text-body">{service.slug}</td>
                  <td className="px-4 py-3 text-body">
                    {service.steps?.length || 0} step{service.steps?.length === 1 ? "" : "s"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-xs px-2 py-1 text-xs font-medium ${
                        service.isActive ? "bg-accent-green/10 text-accent-green" : "bg-box-grey text-text-light"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Button variant="link" onClick={() => handleEditClick(service)}>
                        Edit
                      </Button>
                      <Button variant="linkDanger" onClick={() => handleDelete(service)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
