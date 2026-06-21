"use client";

import { EmptyState, ErrorBanner, Loading } from "@/components/ui/Status";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const statusStyles = {
  PENDING: "bg-gold/15 text-gold",
  APPROVED: "bg-moss/15 text-moss",
  REJECTED: "bg-ink/10 text-ink-soft",
  BANNED: "bg-coral/15 text-coral",
};

export default function ParticipantsPanel({ eventId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/participations/event/${eventId}`,
      );
      setParticipants(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load participants.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function act(id, action) {
    setActingId(id);
    try {
      await api.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/participations/${id}/${action}`,
      );
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Action failed. Please try again.",
      );
    } finally {
      setActingId(null);
    }
  }

  if (loading) return <Loading label="Loading participants…" />;

  return (
    <div className="space-y-3">
      <ErrorBanner message={error} />
      {participants.length === 0 ? (
        <EmptyState
          title="No participants yet"
          hint="Approved and pending requests will show up here."
        />
      ) : (
        participants.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-ink">{p.user.name}</p>
              <p className="text-xs text-ink-soft">{p.user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`stamp rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[p.status]}`}
              >
                {p.status}
              </span>
              {p.status === "PENDING" && (
                <>
                  <button
                    disabled={actingId === p.id}
                    onClick={() => act(p.id, "approve")}
                    className="rounded-full bg-moss px-3 py-1.5 text-xs font-medium text-white transition disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    disabled={actingId === p.id}
                    onClick={() => act(p.id, "reject")}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:text-ink disabled:opacity-60"
                  >
                    Reject
                  </button>
                </>
              )}
              {p.status === "APPROVED" && (
                <button
                  disabled={actingId === p.id}
                  onClick={() => act(p.id, "ban")}
                  className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
