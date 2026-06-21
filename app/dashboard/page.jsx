"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/my-events`);
  }, [router]);
  return null;
}
