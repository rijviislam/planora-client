"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Loading } from "@/components/ui/Status";
import { useAuth } from "@/lib/useAuth";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth({ required: true });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Loading label="Loading your dashboard…" />
        </div>
      </>
    );
  }

  if (!user) return null; // redirect already in flight

  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <Sidebar user={user} onLogout={logout} />
        <main className="min-w-0 flex-1 px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </>
  );
}
