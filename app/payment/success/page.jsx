import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <span className="stamp rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
          Payment received
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">You're almost in</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Your payment went through. The host now needs to approve your request — check your
          dashboard for updates.
        </p>
        <Link
          href="/dashboard/invitations"
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-coral"
        >
          Go to dashboard
        </Link>
      </main>
      <Footer />
    </>
  );
}
