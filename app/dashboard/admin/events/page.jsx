"use client";

import {
  EmptyState,
  ErrorBanner,
  Loading,
  SuccessBanner,
} from "@/components/ui/Status";
import api from "@/lib/api";
import { useAdminGuard } from "@/lib/useAdminGuard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminEventsPage() {
  const { loading: guardLoading } = useAdminGuard();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users/admin/events");
      setEvents(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!guardLoading) load();
  }, [guardLoading]);

  async function handleDelete(id) {
    if (!confirm("Remove this event from the platform? This cannot be undone."))
      return;
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/users/admin/events/${id}`);
      setSuccess("Event removed");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't remove this event.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleFeature(id) {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.patch(`/users/admin/events/${id}/feature`);
      setSuccess(data.message);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't update featured status.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (guardLoading) return <Loading label="Checking access…" />;

  return (
    <div>
      <p className="stamp text-xs text-coral">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
        Manage events
      </h1>

      <div className="mt-8 space-y-3">
        <ErrorBanner message={error} />
        <SuccessBanner message={success} />

        {loading ? (
          <Loading />
        ) : events.length === 0 ? (
          <EmptyState title="No events on the platform yet" />
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm font-medium text-ink hover:text-coral"
                  >
                    {event.title}
                  </Link>
                  {event.isFeatured && (
                    <span className="stamp rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-soft">
                  {event.visibility} ·{" "}
                  {Number(event.fee) === 0 ? "Free" : `৳${event.fee}`} · hosted
                  by {event.owner?.name} ({event.owner?.email})
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={busyId === event.id}
                  onClick={() => handleToggleFeature(event.id)}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink disabled:opacity-60"
                >
                  {event.isFeatured ? "Unfeature" : "Feature"}
                </button>
                <button
                  disabled={busyId === event.id}
                  onClick={() => handleDelete(event.id)}
                  className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                >
                  {busyId === event.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
