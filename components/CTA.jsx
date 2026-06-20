import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
        <div>
          <p className="stamp text-xs text-coral">Last call</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-paper md:text-4xl">
            Got something worth gathering for?
          </h2>
          <p className="mt-3 max-w-md text-sm text-paper/60">
            Set a date, set a price (or don't), and let Planora handle
            approvals, invitations, and payment.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-paper transition hover:bg-paper hover:text-ink"
          >
            Create an event
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-paper/20 px-6 py-3 text-sm font-medium text-paper transition hover:border-paper"
          >
            Join an event
          </Link>
        </div>
      </div>
    </section>
  );
}
