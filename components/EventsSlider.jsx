import Link from "next/link";

function FeeBadge({ fee }) {
  const isFree = Number(fee) === 0;
  return (
    <span
      className={`stamp rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isFree ? "bg-moss/10 text-moss" : "bg-gold/15 text-gold"
      }`}
    >
      {isFree ? "Free" : `৳${fee}`}
    </span>
  );
}

export default function EventsSlider({ events = [] }) {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="stamp text-xs text-coral">Departures board</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
              Upcoming events
            </h2>
          </div>
          <Link href="/events" className="hidden text-sm font-medium text-ink-soft hover:text-ink md:block">
            View all →
          </Link>
        </div>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {events.length === 0 && (
            <p className="text-sm text-ink-soft">No upcoming events yet.</p>
          )}
          {events.map((event) => {
            const date = new Date(event.date);
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="ticket flex w-72 shrink-0 flex-col"
              >
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="stamp text-[10px] text-ink-soft">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <FeeBadge fee={event.fee} />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-soft">
                    Hosted by {event.owner?.name || "Planora"}
                  </p>
                </div>
                <div className="ticket-stub-divider mx-5" />
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="stamp text-[10px] text-ink-soft">Admit one</span>
                  <span className="text-sm font-medium text-coral">Details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
