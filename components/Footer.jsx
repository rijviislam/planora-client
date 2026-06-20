import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">
            Planora<span className="text-coral">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-paper/60">
            Every gathering needs a ticket. Plan, host, and join events that
            matter — public or private, free or paid.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="stamp text-xs text-paper/40">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="text-paper/80 hover:text-coral">About</Link></li>
              <li><Link href="/contact" className="text-paper/80 hover:text-coral">Contact</Link></li>
              <li><Link href="/privacy" className="text-paper/80 hover:text-coral">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="stamp text-xs text-paper/40">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/events" className="text-paper/80 hover:text-coral">Browse events</Link></li>
              <li><Link href="/signup" className="text-paper/80 hover:text-coral">Create an event</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 px-5 py-5 text-center text-xs text-paper/40 md:px-8">
        © {new Date().getFullYear()} Planora. All rights reserved.
      </div>
    </footer>
  );
}
