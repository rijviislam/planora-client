import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentFailPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <span className="stamp rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
          Payment failed
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Your payment couldn't be completed. No charge was made — you can try again from the
          event page.
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
