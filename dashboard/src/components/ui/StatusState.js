// Shared loading/empty/error treatments so all five resource pages present
// these states the same way instead of a bare, unstyled <p>.

import { Loader2, AlertCircle, CheckCircle2, Inbox } from "lucide-react";

export function LoadingState({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-border bg-white px-6 py-16 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-text-light" />
      <p className="text-sm text-body">{message}</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xs border border-primary bg-primary/5 px-4 py-3 text-sm text-primary-text"
    >
      <AlertCircle className="h-5 w-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function SuccessState({ message }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xs border border-accent-green bg-accent-green/10 px-4 py-3 text-sm text-accent-green"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ message, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-border bg-white px-6 py-16 text-center">
      <Icon className="h-8 w-8 text-text-lighter" />
      <p className="text-sm text-body">{message}</p>
    </div>
  );
}
