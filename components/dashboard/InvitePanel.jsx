"use client";

import { ErrorBanner, SuccessBanner } from "@/components/ui/Status";
import api from "@/lib/api";
import { useState } from "react";

export default function InvitePanel({ eventId }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  async function handleInvite(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setSending(true);
    try {
      await api.post("/invitations", { eventId, invitedEmail: email });
      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send this invitation.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleInvite} className="flex flex-wrap items-start gap-2">
      <div className="min-w-[220px] flex-1">
        <input
          type="email"
          placeholder="Invite by email…"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-ink/15 bg-white px-4 py-2 text-xs outline-none focus:border-ink"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition hover:bg-coral disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send invite"}
      </button>
      <div className="w-full">
        <ErrorBanner message={error} />
        <SuccessBanner message={success} />
      </div>
    </form>
  );
}
