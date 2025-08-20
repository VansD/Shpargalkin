// AdminApp/frontend/shared/ui/Navbar.tsx
"use client";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout, authenticated, loading } = useAuth();
  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        borderBottom: "1px solid #ccc",
      }}
    >
      {authenticated && (
        <>
          <Link href="/">Dashboard</Link>
          <Link href="/tasks">Задания</Link>
          <Link href="/stages">Этапы</Link>
          <Link href="/moderation">Модерация</Link>
          <Link href="/users">Пользователи</Link>
          <Link href="/analytics">Аналитика</Link>
          <div style={{ marginLeft: "auto" }}>
            <LogoutButton />
          </div>
        </>
      )}
    </nav>
  );
}
