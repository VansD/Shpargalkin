// frontend/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";

type User = {
  id: number;
  email: string;
  role: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: "include",
        });

        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return { user, loading, logout, authenticated: !!user };
}
