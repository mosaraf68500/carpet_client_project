"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/api";
import Button from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";

const PAGE_SIZE = 20;

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  // Used by event handlers (filter toggle, pagination) — safe to call by
  // reference there since it's never invoked directly from an effect body.
  const loadMessages = async (pageToLoad, unreadOnlyFilter) => {
    try {
      const result = await getMessages({ page: pageToLoad, limit: PAGE_SIZE, unreadOnly: unreadOnlyFilter });
      setMessages(result.items);
      setTotalPages(result.totalPages);
      setPage(result.page);
      setUnreadCount(result.unreadCount);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Failed to load messages.");
      setStatus("error");
    }
  };

  // Fetches inline (rather than calling loadMessages by reference) so every
  // state update stays inside a .then()/.catch() callback, not the effect's
  // own synchronous body.
  useEffect(() => {
    let cancelled = false;

    getMessages({ page: 1, limit: PAGE_SIZE, unreadOnly: false }).then(
      (result) => {
        if (cancelled) return;
        setMessages(result.items);
        setTotalPages(result.totalPages);
        setPage(result.page);
        setUnreadCount(result.unreadCount);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load messages.");
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFilterChange = (nextUnreadOnly) => {
    setUnreadOnly(nextUnreadOnly);
    setStatus("loading");
    setError("");
    loadMessages(1, nextUnreadOnly);
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setStatus("loading");
    setError("");
    loadMessages(nextPage, unreadOnly);
  };

  const handleMarkAsRead = async (message) => {
    try {
      await markMessageRead(message._id);
      setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, isRead: true } : m)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      window.alert(err.message || "Failed to mark message as read.");
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm(`Delete the message from "${message.name}"? This cannot be undone.`)) return;
    try {
      await deleteMessage(message._id);
      setMessages((prev) => prev.filter((m) => m._id !== message._id));
      if (!message.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      window.alert(err.message || "Failed to delete message.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-heading">Messages</h1>
          {unreadCount > 0 && (
            <span className="rounded-xs bg-primary px-2 py-1 text-xs font-medium text-white">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="flex overflow-hidden rounded-xs border border-border-form">
          <button
            type="button"
            onClick={() => handleFilterChange(false)}
            className={`px-4 py-2 text-sm ${!unreadOnly ? "bg-black text-white" : "bg-white text-body"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange(true)}
            className={`border-l border-border-form px-4 py-2 text-sm ${
              unreadOnly ? "bg-black text-white" : "bg-white text-body"
            }`}
          >
            Unread only
          </button>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading messages…" />}

      {status === "error" && <ErrorState message={error} />}

      {status === "ready" && messages.length === 0 && (
        <EmptyState icon={MessageSquare} message={unreadOnly ? "No unread messages." : "No messages yet."} />
      )}

      {status === "ready" && messages.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex flex-col gap-3 rounded-xs border p-5 ${
                  message.isRead ? "border-border bg-white" : "border-primary bg-primary/5"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm text-heading ${message.isRead ? "font-medium" : "font-semibold"}`}>
                      {message.name}
                    </p>
                    <p className="text-sm text-body">
                      {message.phone} · {message.email}
                    </p>
                  </div>
                  <p className="text-xs text-text-light">{formatDate(message.createdAt)}</p>
                </div>

                {message.message && <p className="whitespace-pre-wrap text-sm text-body">{message.message}</p>}

                {message.product && (
                  <p className="text-xs text-text-light">
                    Re: <span className="text-link">{message.product.title}</span>
                  </p>
                )}

                <div className="flex gap-4">
                  {!message.isRead && (
                    <Button variant="link" onClick={() => handleMarkAsRead(message)}>
                      Mark as read
                    </Button>
                  )}
                  <Button variant="linkDanger" onClick={() => handleDelete(message)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
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
