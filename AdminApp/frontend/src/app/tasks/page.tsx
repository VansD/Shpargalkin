"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import TasksTable from "@/components/tasks/TasksTable";

export default function TasksPage() {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    }
  }, [loading, authenticated, router]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (!authenticated) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Админка</h1>
      <p className="mb-6">Добро пожаловать, {user?.email} 👋</p>

      <TasksTable />
    </main>
  );
}
