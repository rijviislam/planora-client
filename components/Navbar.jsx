"use client";

import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-ink"
        >
          Planora<span className="text-coral">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-ink/15 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink transition hover:border-ink"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                {user.name?.split(" ")[0]}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-ink/10 bg-white py-1 shadow-[0_16px_30px_-18px_rgba(27,31,59,0.35)]">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-soft transition hover:bg-ink/5 hover:text-ink"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-coral transition hover:bg-coral/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-coral"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-ink/10 px-5 py-5 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-ink-soft"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="w-fit text-sm font-medium text-coral"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink-soft">
                Log in
              </Link>
              <Link
                href="/signup"
                className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
