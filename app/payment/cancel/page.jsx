import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <span className="stamp rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-soft">
          Payment cancelled
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">No charge made</h1>
        <p className="mt-3 text-sm text-ink-soft">
          You cancelled checkout. You can pick up where you left off any time from the event page.
        </p>
        <Link
          href="/events"
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-coral"
        >
          Back to events
        </Link>
      </main>
      <Footer />
    </>
  );
}
