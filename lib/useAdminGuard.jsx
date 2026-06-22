"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
