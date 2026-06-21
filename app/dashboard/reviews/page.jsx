"use client";

import { EmptyState, ErrorBanner, Loading } from "@/components/ui/Status";
import api from "@/lib/api";
import { useEffect, useState } from "react";

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className={`text-lg ${n <= value ? "text-gold" : "text-ink/15"} ${
            onChange ? "cursor-pointer" : ""
          }`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ rating: 5, comment: "" });
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/mine`,
      );
      setReviews(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(review) {
    setEditingId(review.id);
    setDraft({ rating: review.rating, comment: review.comment });
    setError("");
  }

  async function saveEdit(id) {
    setBusyId(id);
    setError("");
    try {
      await api.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        draft,
      );
      setEditingId(null);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't save this review (the edit window may have passed).",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this review?")) return;
    setBusyId(id);
    setError("");
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't delete this review (the edit window may have passed).",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <p className="stamp text-xs text-coral">Reviews</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
        My reviews
      </h1>

      <div className="mt-8 space-y-3">
        <ErrorBanner message={error} />

        {loading ? (
          <Loading />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            hint="Once you attend an approved event, you can leave a review from its event page."
          />
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-ticket border border-ink/10 bg-white p-5"
            >
              <p className="font-display text-lg font-semibold text-ink">
                {review.event?.title}
              </p>

              {editingId === review.id ? (
                <div className="mt-3 space-y-3">
                  <Stars
                    value={draft.rating}
                    onChange={(n) => setDraft({ ...draft, rating: n })}
                  />
                  <textarea
                    rows={3}
                    value={draft.comment}
                    onChange={(e) =>
                      setDraft({ ...draft, comment: e.target.value })
                    }
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === review.id}
                      onClick={() => saveEdit(review.id)}
                      className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition hover:bg-coral disabled:opacity-60"
                    >
                      {busyId === review.id ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-2">
                    <Stars value={review.rating} />
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{review.comment}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => startEdit(review)}
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                    >
                      Edit
                    </button>
                    <button
                      disabled={busyId === review.id}
                      onClick={() => handleDelete(review.id)}
                      className="rounded-full border border-coral/30 px-4 py-2 text-xs font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
