import Link from "next/link";

export default function Hero({ event }) {
  const date = event ? new Date(event.date) : null;

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
              href="/signup"
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              Host your own
            </Link>
          </div>
        </div>

        {event ? (
          <div className="ticket flex shadow-[0_20px_50px_-20px_rgba(27,31,59,0.25)]">
            <div className="flex-1 p-6 md:p-8">
              <p className="stamp text-xs text-coral">Featured event</p>
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
                href={`${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`}
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
      </div>
    </section>
  );
}
