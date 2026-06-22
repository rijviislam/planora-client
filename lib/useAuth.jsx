"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth({ required = false } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("planora_user")
        : null;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("planora_token")
        : null;

    if (raw && token) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);

    if (required && (!raw || !token)) {
      router.push("/login");
    }
  }, [required]);

  function logout() {
    localStorage.removeItem("planora_token");
    localStorage.removeItem("planora_user");
    setUser(null);
    router.push("/login");
  }

  return { user, loading, logout };
}
