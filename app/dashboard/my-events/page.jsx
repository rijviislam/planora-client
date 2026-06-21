"use client";

import EventForm from "@/components/dashboard/EventForm";
import InvitePanel from "@/components/dashboard/InvitePanel";
import ParticipantsPanel from "@/components/dashboard/ParticipantsPanel";
import Modal from "@/components/ui/Modal";
import { EmptyState, ErrorBanner, Loading } from "@/components/ui/Status";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [participantsEventId, setParticipantsEventId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events/mine`,
      );
      setEvents(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't load your events. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingEvent(null);
    setFormOpen(true);
  }

  function openEdit(event) {
    setEditingEvent(event);
    setFormOpen(true);
  }

  async function handleSaved() {
    setFormOpen(false);
    setEditingEvent(null);
    await load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this event.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="stamp text-xs text-coral">My events</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            Events you're hosting
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-coral"
        >
          + Create event
        </button>
      </div>

      <div className="mt-8">
        <ErrorBanner message={error} />
        {loading ? (
          <Loading />
        ) : events.length === 0 ? (
          <EmptyState
            title="You haven't created any events yet"
            hint="Create one to start inviting people and tracking RSVPs."
          />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-ticket border border-ink/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {event.title}
                      </h3>
                      <span className="stamp rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-semibold text-ink-soft">
                        {event.visibility}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · {event.venue} ·{" "}
                      {Number(event.fee) === 0 ? "Free" : `৳${event.fee}`}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {event._count?.participations ?? 0} participant(s)
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setParticipantsEventId(
                          participantsEventId === event.id ? null : event.id,
                        )
                      }
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                    >
                      {participantsEventId === event.id
                        ? "Hide participants"
                        : "Manage participants"}
                    </button>
                    <button
                      onClick={() => openEdit(event)}
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                    >
                      Edit
                    </button>
                    <button
                      disabled={deletingId === event.id}
                      onClick={() => handleDelete(event.id)}
                      className="rounded-full border border-coral/30 px-4 py-2 text-xs font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                    >
                      {deletingId === event.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                {participantsEventId === event.id && (
                  <div className="mt-5 border-t border-ink/10 pt-5">
                    <p className="stamp mb-2 text-[10px] text-ink-soft">
                      Invite someone directly
                    </p>
                    <InvitePanel eventId={event.id} />
                    <p className="stamp mb-2 mt-6 text-[10px] text-ink-soft">
                      Participants
                    </p>
                    <ParticipantsPanel eventId={event.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingEvent ? "Edit event" : "Create event"}
      >
        <EventForm
          initial={editingEvent}
          onSaved={handleSaved}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
