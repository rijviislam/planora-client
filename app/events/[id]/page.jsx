"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { Loading, ErrorBanner, SuccessBanner } from "@/components/ui/Status";

function Stars({ value }) {
  return (
    <span aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "text-gold" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

function actionLabel(event) {
  const isFree = Number(event.fee) === 0;
  const isPublic = event.visibility === "PUBLIC";
  if (isPublic && isFree) return "Join";
  if (isPublic && !isFree) return "Pay & join";
  if (!isPublic && isFree) return "Request to join";
  return "Pay & request";
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [acting, setActing] = useState(false);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load this event.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handlePrimaryAction() {
    if (!user) {
      router.push("/login");
      return;
    }
    setActionError("");
    setActionSuccess("");
    setActing(true);
    try {
      if (Number(event.fee) > 0) {
        const { data } = await api.post("/payments/init", { eventId: event.id });
        window.location.href = data.data.paymentUrl;
        return;
      }
      const { data } = await api.post(`/participations/${event.id}/join`);
      setActionSuccess(data.message);
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't complete that action.");
    } finally {
      setActing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.delete(`/events/${event.id}`);
      router.push("/dashboard/my-events");
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't delete this event.");
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError("");
    if (!reviewDraft.comment.trim()) {
      setReviewError("Please write a short comment");
      return;
    }
    setReviewSaving(true);
    try {
      await api.post("/reviews", { eventId: event.id, ...reviewDraft });
      setReviewOpen(false);
      setReviewDraft({ rating: 5, comment: "" });
      await load();
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Only approved participants can review this event."
      );
    } finally {
      setReviewSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <Loading label="Loading event…" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <ErrorBanner message={error || "Event not found."} />
          <Link href="/events" className="mt-4 inline-block text-sm font-medium text-ink hover:text-coral">
            ← Back to events
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const date = new Date(event.date);
  const isOwner = user && user.id === event.owner?.id;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <Link href="/events" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to events
        </Link>

        <div className="ticket mt-6 flex flex-col md:flex-row">
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="stamp rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-semibold text-ink-soft">
                {event.visibility}
              </span>
              <span
                className={`stamp rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  Number(event.fee) === 0 ? "bg-moss/10 text-moss" : "bg-gold/15 text-gold"
                }`}
              >
                {Number(event.fee) === 0 ? "Free" : `৳${event.fee}`}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl">
              {event.title}
            </h1>

            <p className="mt-3 text-sm text-ink-soft">
              {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {" · "}
              {event.time} · {event.venue}
            </p>

            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {event.description}
            </p>

            <p className="mt-5 text-sm text-ink-soft">
              Hosted by <span className="font-medium text-ink">{event.owner?.name}</span>
            </p>
          </div>

          <div className="ticket-stub-divider my-4 hidden md:block" />

          <div className="flex w-full shrink-0 flex-col items-center justify-center gap-3 p-6 text-center md:w-44">
            {isOwner ? (
              <>
                <p className="stamp text-[10px] text-ink-soft">You're hosting this</p>
                <Link
                  href="/dashboard/my-events"
                  className="stamp w-full rounded-full bg-ink px-4 py-2.5 text-[10px] font-semibold text-paper"
                >
                  Manage event
                </Link>
                <button
                  onClick={handleDelete}
                  className="stamp w-full rounded-full border border-coral/30 px-4 py-2.5 text-[10px] font-semibold text-coral"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={handlePrimaryAction}
                disabled={acting}
                className="stamp w-full rounded-full bg-coral px-4 py-2.5 text-[10px] font-semibold text-paper transition disabled:opacity-60"
              >
                {acting ? "Working…" : actionLabel(event)}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <ErrorBanner message={actionError} />
          <SuccessBanner message={actionSuccess} />
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Reviews</h2>
            {user && !isOwner && (
              <button
                onClick={() => setReviewOpen((o) => !o)}
                className="text-sm font-medium text-ink hover:text-coral"
              >
                {reviewOpen ? "Cancel" : "Leave a review"}
              </button>
            )}
          </div>

          {reviewOpen && (
            <form onSubmit={submitReview} className="mt-4 rounded-ticket border border-ink/10 bg-white p-5">
              <ErrorBanner message={reviewError} />
              <div className="mt-2 flex gap-1 text-xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewDraft({ ...reviewDraft, rating: n })}
                    className={n <= reviewDraft.rating ? "text-gold" : "text-ink/15"}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="How was it?"
                value={reviewDraft.comment}
                onChange={(e) => setReviewDraft({ ...reviewDraft, comment: e.target.value })}
                className="mt-3 w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
              <button
                type="submit"
                disabled={reviewSaving}
                className="mt-3 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-coral disabled:opacity-60"
              >
                {reviewSaving ? "Submitting…" : "Submit review"}
              </button>
            </form>
          )}

          <div className="mt-6 space-y-4">
            {(!event.reviews || event.reviews.length === 0) && (
              <p className="text-sm text-ink-soft">No reviews yet.</p>
            )}
            {event.reviews?.map((r) => (
              <div key={r.id} className="border-b border-ink/10 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{r.user?.name}</p>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
