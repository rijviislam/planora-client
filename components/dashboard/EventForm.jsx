"use client";

import { useState } from "react";
import FormField from "@/components/FormField";
import api from "@/lib/api";

const empty = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  visibility: "PUBLIC",
  fee: "0",
};

export default function EventForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...empty,
    ...(initial
      ? {
          ...initial,
          date: initial.date ? initial.date.slice(0, 10) : "",
          fee: String(initial.fee ?? "0"),
        }
      : {}),
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.date) next.date = "Date is required";
    if (!form.time) next.time = "Time is required";
    if (!form.venue.trim()) next.venue = "Venue is required";
    if (form.fee !== "" && (isNaN(Number(form.fee)) || Number(form.fee) < 0)) {
      next.fee = "Fee must be a non-negative number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = { ...form, fee: Number(form.fee || 0) };

    setSaving(true);
    try {
      if (initial?.id) {
        await api.patch(`/events/${initial.id}`, payload);
      } else {
        await api.post("/events", payload);
      }
      onSaved();
    } catch (err) {
      setServerError(err.response?.data?.message || "Couldn't save this event. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">{serverError}</div>
      )}

      <FormField
        label="Title"
        value={form.title}
        error={errors.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <label className="block">
        <span className="text-sm font-medium text-ink">Description</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink ${
            errors.description ? "border-coral" : "border-ink/15"
          }`}
        />
        {errors.description && (
          <span className="mt-1 block text-xs text-coral">{errors.description}</span>
        )}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Date"
          type="date"
          value={form.date}
          error={errors.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <FormField
          label="Time"
          type="time"
          value={form.time}
          error={errors.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
      </div>

      <FormField
        label="Venue"
        value={form.venue}
        error={errors.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Visibility</span>
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </label>
        <FormField
          label="Registration fee (৳)"
          type="number"
          min="0"
          value={form.fee}
          error={errors.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : initial?.id ? "Save changes" : "Create event"}
        </button>
      </div>
    </form>
  );
}
