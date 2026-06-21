"use client";

import {
  EmptyState,
  ErrorBanner,
  Loading,
  SuccessBanner,
} from "@/components/ui/Status";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actingId, setActingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/mine`,
      );
      setInvitations(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't load your invitations.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAccept(invitation) {
    setActingId(invitation.id);
    setError("");
    setSuccess("");
    try {
      if (Number(invitation.event.fee) > 0) {
        const { data } = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/init`,
          {
            eventId: invitation.eventId,
            invitationId: invitation.id,
          },
        );
        window.location.href = data.data.paymentUrl;
        return;
      }
      await api.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/${invitation.id}/accept`,
      );
      setSuccess("Invitation accepted!");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't accept this invitation.",
      );
    } finally {
      setActingId(null);
    }
  }

  async function handleDecline(id) {
    setActingId(id);
    setError("");
    setSuccess("");
    try {
      await api.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/${id}/decline`,
      );
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't decline this invitation.",
      );
    } finally {
      setActingId(null);
    }
  }

  return (
    <div>
      <p className="stamp text-xs text-coral">Invitations</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
        Pending invitations
      </h1>

      <div className="mt-8 space-y-3">
        <ErrorBanner message={error} />
        <SuccessBanner message={success} />

        {loading ? (
          <Loading />
        ) : invitations.length === 0 ? (
          <EmptyState
            title="No pending invitations"
            hint="Invitations hosts send you will show up here."
          />
        ) : (
          invitations
            .filter((i) => i.status === "PENDING")
            .map((inv) => (
              <div
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-ticket border border-ink/10 bg-white p-5"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    {inv.event.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Invited by {inv.invitedBy?.name} ·{" "}
                    {new Date(inv.event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    ·{" "}
                    {Number(inv.event.fee) === 0 ? "Free" : `৳${inv.event.fee}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={actingId === inv.id}
                    onClick={() => handleAccept(inv)}
                    className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition hover:bg-coral disabled:opacity-60"
                  >
                    {Number(inv.event.fee) > 0 ? "Pay & accept" : "Accept"}
                  </button>
                  <button
                    disabled={actingId === inv.id}
                    onClick={() => handleDecline(inv.id)}
                    className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink disabled:opacity-60"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
