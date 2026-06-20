"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/my-events", label: "My events" },
  { href: "/dashboard/invitations", label: "Pending invitations" },
  { href: "/dashboard/reviews", label: "My reviews" },
  { href: "/dashboard/settings", label: "Settings" },
];

const adminLinks = [
  { href: "/dashboard/admin/users", label: "Manage users" },
  { href: "/dashboard/admin/events", label: "Manage events" },
];

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-ink/10 bg-paper-dim md:w-60 md:border-b-0 md:border-r">
      <div className="px-5 py-6">
        <p className="stamp text-[10px] text-ink-soft">Signed in as</p>
        <p className="mt-1 truncate font-display text-base font-semibold text-ink">
          {user?.name}
        </p>
        {user?.role === "ADMIN" && (
          <span className="stamp mt-2 inline-block rounded-full bg-coral/15 px-2.5 py-1 text-[10px] font-semibold text-coral">
            Admin
          </span>
        )}
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}

        {user?.role === "ADMIN" && (
          <>
            <p className="stamp mt-3 px-3 text-[10px] text-ink-soft md:mt-4">Admin</p>
            {adminLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="px-3 pb-6 pt-2">
        <button
          onClick={onLogout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-soft transition hover:bg-coral/10 hover:text-coral"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
