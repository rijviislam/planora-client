"use client";

import { useState } from "react";
import FormField from "@/components/FormField";
import api from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Status";

export default function SettingsPage() {
  const { user } = useAuth({ required: true });
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // user may not be loaded yet on first paint; sync once available
  if (user && name === "" && user.name) {
    setName(user.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.patch("/users/me", { name });
      localStorage.setItem("planora_user", JSON.stringify(data.data));
      setSuccess("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-md">
      <p className="stamp text-xs text-coral">Settings</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Profile</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <ErrorBanner message={error} />
        <SuccessBanner message={success} />

        <FormField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            disabled
            value={user?.email || ""}
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-ink/15 bg-paper-dim px-4 py-2.5 text-sm text-ink-soft"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-10 border-t border-ink/10 pt-6">
        <p className="stamp text-xs text-ink-soft">Notifications</p>
        <p className="mt-2 text-sm text-ink-soft">
          Email notifications for invitations and approvals are on by default. Granular controls
          are coming soon.
        </p>
      </div>
    </div>
  );
}
