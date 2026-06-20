"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { Loading, ErrorBanner, SuccessBanner, EmptyState } from "@/components/ui/Status";

export default function AdminUsersPage() {
  const { loading: guardLoading } = useAdminGuard();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users");
      setUsers(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!guardLoading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardLoading]);

  async function handleBan(id) {
    if (!confirm("Ban this user? They will no longer be able to log in.")) return;
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/users/${id}/ban`);
      setSuccess("User banned");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't ban this user.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Permanently delete this account? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/users/${id}`);
      setSuccess("User account deleted");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this user.");
    } finally {
      setBusyId(null);
    }
  }

  if (guardLoading) return <Loading label="Checking access…" />;

  return (
    <div>
      <p className="stamp text-xs text-coral">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Manage users</h1>

      <div className="mt-8 space-y-3">
        <ErrorBanner message={error} />
        <SuccessBanner message={success} />

        {loading ? (
          <Loading />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{u.name}</p>
                  <span className="stamp rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                    {u.role}
                  </span>
                  {u.isBanned && (
                    <span className="stamp rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-semibold text-coral">
                      Banned
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-soft">{u.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={busyId === u.id || u.isBanned}
                  onClick={() => handleBan(u.id)}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink disabled:opacity-60"
                >
                  {u.isBanned ? "Banned" : "Ban"}
                </button>
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleDelete(u.id)}
                  className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
