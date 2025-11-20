"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getToken } from "@/lib/api";

export function useAuthGuard(options = {}) {
  const router = useRouter();
  const redirectTo = options.redirectTo || "/login";
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getToken();
    const storedUser = getCurrentUser();

    if (!token || !storedUser?._id) {
      router.replace(redirectTo);
      return;
    }

    const timeout = window.setTimeout(() => {
      setUser(storedUser);
      setChecking(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router, redirectTo]);

  return { user, checking };
}
