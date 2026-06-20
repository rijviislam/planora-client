"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsSlider from "@/components/EventsSlider";
import api from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .get("/events", { params: { search, limit: 12 } })
      .then(({ data }) => {
        if (active) setEvents(data.data);
      })
      .catch(() => {
        if (active) setError("Couldn't load events right now. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search]);

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

        <div className="mt-10">
          {loading && <p className="text-sm text-ink-soft">Loading events…</p>}
          {error && <p className="text-sm text-coral">{error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className="text-sm text-ink-soft">No events match your search.</p>
          )}
        </div>
      </main>
      {!loading && !error && events.length > 0 && <EventsSlider events={events} />}
      <Footer />
    </>
  );
}
