"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FolderTree, Wrench, MessageSquare } from "lucide-react";
import { getAdminProducts, getCategories, getAdminServices, getMessages } from "@/lib/api";
import { useAdmin } from "@/lib/adminContext";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xs border p-5 ${
        highlight ? "border-primary bg-primary/5" : "border-border bg-white"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xs ${
          highlight ? "bg-primary text-white" : "bg-box-grey text-text-light"
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-heading">{value}</p>
        <p className="text-sm text-body">{label}</p>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { dateStyle: "medium" });
}

export default function DashboardHomePage() {
  const admin = useAdmin();

  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading"); // loading | ready | error
  const [statsError, setStatsError] = useState("");

  const [recentMessages, setRecentMessages] = useState([]);
  const [messagesStatus, setMessagesStatus] = useState("loading"); // loading | ready | error
  const [messagesError, setMessagesError] = useState("");

  // Two independent fetch effects (not one combined Promise.all) so the
  // stats grid and the recent-messages list degrade independently — a
  // failure in one doesn't blank the other. Within the stats group itself,
  // the four calls run together via Promise.all since they're one section.
  useEffect(() => {
    let cancelled = false;

    Promise.all([getAdminProducts({ limit: 1 }), getCategories(), getAdminServices(), getMessages({ limit: 1 })]).then(
      ([products, categories, services, messages]) => {
        if (cancelled) return;
        setStats({
          products: products.total,
          categories: categories.length,
          services: services.length,
          unreadMessages: messages.unreadCount,
        });
        setStatsStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setStatsError(err.message || "Failed to load overview stats.");
        setStatsStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getMessages({ limit: 5 }).then(
      (result) => {
        if (cancelled) return;
        setRecentMessages(result.items);
        setMessagesStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setMessagesError(err.message || "Failed to load recent messages.");
        setMessagesStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-heading">
        Welcome back{admin?.email ? `, ${admin.email}` : ""}
      </h1>

      {statsStatus === "loading" && <LoadingState message="Loading overview…" />}
      {statsStatus === "error" && <ErrorState message={statsError} />}
      {statsStatus === "ready" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Package} label="Total Products" value={stats.products} />
          <StatCard icon={FolderTree} label="Total Categories" value={stats.categories} />
          <StatCard icon={Wrench} label="Total Services" value={stats.services} />
          <StatCard
            icon={MessageSquare}
            label="Unread Messages"
            value={stats.unreadMessages}
            highlight={stats.unreadMessages > 0}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-heading">Recent Messages</h2>

        {messagesStatus === "loading" && <LoadingState message="Loading recent messages…" />}
        {messagesStatus === "error" && <ErrorState message={messagesError} />}
        {messagesStatus === "ready" && recentMessages.length === 0 && (
          <EmptyState icon={MessageSquare} message="No messages yet." />
        )}
        {messagesStatus === "ready" && recentMessages.length > 0 && (
          <div className="flex flex-col divide-y divide-border rounded-xs border border-border bg-white">
            {recentMessages.map((message) => (
              <Link
                key={message._id}
                href="/messages"
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-box-grey"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {!message.isRead && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm text-heading ${message.isRead ? "font-medium" : "font-semibold"}`}>
                      {message.name}
                    </p>
                    <p className="truncate text-sm text-body">{message.message || "—"}</p>
                  </div>
                </div>
                <p className="shrink-0 text-xs text-text-light">{formatDate(message.createdAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
