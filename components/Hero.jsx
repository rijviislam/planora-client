"use client";

import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero({ events = [] }) {
  const { user } = useAuth();
  const hostHref = user ? "/dashboard/my-events" : "/signup";

  const [index, setIndex] = useState(0);
  const hasMultiple = events.length > 1;
  const event = events[index] || null;
  const date = event ? new Date(event.date) : null;

  // Auto-rotate every 6s when there's more than one featured event
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hasMultiple, events.length]);

  function goTo(i) {
    setIndex(((i % events.length) + events.length) % events.length);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="stamp text-xs font-medium text-coral">Now boarding</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Plan it.
            <br />
            <span className="italic text-coral">Stamp it.</span>
            <br />
            Show up.
          </h1>
          <p className="mt-6 max-w-md text-base text-ink-soft md:text-lg">
            Planora is where hosts issue admission and guests collect it —
            public or private, free or paid, every event gets a ticket worth
            keeping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-coral"
            >
              Browse events
            </Link>
            <Link
              href={hostHref}
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              Host your own
            </Link>
          </div>
        </div>

        <div>
          {event ? (
            <div className="ticket flex shadow-[0_20px_50px_-20px_rgba(27,31,59,0.25)]">
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <p className="stamp text-xs text-coral">Featured event</p>
                  {hasMultiple && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Previous featured event"
                        onClick={() => goTo(index - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="Next featured event"
                        onClick={() => goTo(index + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
                  {event.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-ink-soft">
                  {event.description}
                </p>
                <p className="mt-4 text-sm text-ink-soft">
                  Hosted by{" "}
                  <span className="font-medium text-ink">
                    {event.owner?.name}
                  </span>
                </p>
              </div>
              <div className="ticket-stub-divider my-4" />
              <div className="flex w-32 shrink-0 flex-col items-center justify-center gap-1 p-4 text-center md:w-36">
                <p className="stamp text-[10px] text-ink-soft">
                  {date?.toLocaleDateString("en-US", { month: "short" })}
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {date?.getDate()}
                </p>
                <p className="stamp text-[10px] text-ink-soft">
                  {date?.getFullYear()}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="stamp mt-4 rounded-full bg-coral px-3 py-1.5 text-[10px] font-semibold text-paper"
                >
                  Join
                </Link>
              </div>
            </div>
          ) : (
            <div className="ticket flex h-64 items-center justify-center p-8 text-center">
              <p className="text-sm text-ink-soft">
                No featured event yet — check back soon.
              </p>
            </div>
          )}

          {hasMultiple && (
            <div className="mt-4 flex justify-center gap-1.5">
              {events.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  aria-label={`Show featured event ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-coral" : "w-1.5 bg-ink/15"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
