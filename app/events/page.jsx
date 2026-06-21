"use client";

import EventsSlider from "@/components/EventsSlider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const categories = [
  {
    key: "ALL",
    label: "All events",
    visibility: undefined,
    feeType: undefined,
  },
  {
    key: "PUBLIC_FREE",
    label: "Public · Free",
    visibility: "PUBLIC",
    feeType: "FREE",
  },
  {
    key: "PUBLIC_PAID",
    label: "Public · Paid",
    visibility: "PUBLIC",
    feeType: "PAID",
  },
  {
    key: "PRIVATE_FREE",
    label: "Private · Free",
    visibility: "PRIVATE",
    feeType: "FREE",
  },
  {
    key: "PRIVATE_PAID",
    label: "Private · Paid",
    visibility: "PRIVATE",
    feeType: "PAID",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const { visibility, feeType } = categories.find((c) => c.key === category);

    api
      .get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        params: { search, visibility, feeType, limit: 12 },
      })
      .then(({ data }) => {
        if (active) setEvents(data.data);
      })
      .catch(() => {
        if (active)
          setError("Couldn't load events right now. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    return () => {
      active = false;
    };
  }, [search, category]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="stamp text-xs text-coral">All events</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
          Find your next event
        </h1>

        <input
          type="text"
          placeholder="Search by title or organizer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full max-w-md rounded-full border border-ink/15 bg-white px-5 py-3 text-sm outline-none focus:border-ink"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`stamp rounded-full px-4 py-2 text-[11px] font-semibold transition ${
                category === c.key
                  ? "bg-ink text-paper"
                  : "border border-ink/15 text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {category.startsWith("PRIVATE") && (
          <p className="mt-3 text-xs text-ink-soft">
            Private events are visible here, but joining requires the host to
            approve your request.
          </p>
        )}

        <div className="mt-10">
          {loading && <p className="text-sm text-ink-soft">Loading events…</p>}
          {error && <p className="text-sm text-coral">{error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className="text-sm text-ink-soft">
              No events match your search.
            </p>
          )}
        </div>
      </main>
      {!loading && !error && events.length > 0 && (
        <EventsSlider events={events} />
      )}
      <Footer />
    </>
  );
}
