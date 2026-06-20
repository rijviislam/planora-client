export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-3 py-10 text-sm text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      {label}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral" role="alert">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-moss/10 px-4 py-3 text-sm text-moss" role="status">
      {message}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-ticket border border-dashed border-ink/20 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}
