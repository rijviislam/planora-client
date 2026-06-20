"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

// Wraps useAuth and additionally redirects non-admin users back to the
// regular dashboard, so admin-only pages can't be reached by URL guessing.
export function useAdminGuard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth({ required: true });

  useEffect(() => {
    if (!loading && user && user.role !== "ADMIN") {
      router.replace("/dashboard/my-events");
    }
  }, [loading, user, router]);

  return { user, loading: loading || (user && user.role !== "ADMIN"), logout };
}
