"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import api from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Use at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("planora_token", data.data.token);
      localStorage.setItem("planora_user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 md:px-0">
        <p className="stamp text-xs text-coral">Get your ticket</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Host gatherings or join the ones that find you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          {serverError && (
            <div className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">
              {serverError}
            </div>
          )}

          <FormField
            label="Full name"
            type="text"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormField
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormField
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 text-sm font-medium text-paper transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink hover:text-coral">
            Log in
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
