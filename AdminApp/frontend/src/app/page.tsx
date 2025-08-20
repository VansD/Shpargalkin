// frontend/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !authenticated) {
  //     router.push("/login");
  //   }
  // }, [loading, authenticated, router]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-xl">
  //       Загрузка...
  //     </div>
  //   );
  // }

  // if (!authenticated) {
  //   return null;
  // }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Админка</h1>
      <p>Добро пожаловать, {user?.email} 👋</p>

      {/* Здесь можно вывести дашборд: метрики, задания, кнопки для CRUD */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded-lg">📊 Статистика</div>
        <div className="p-4 bg-white shadow rounded-lg">📚 Задания</div>
        <div className="p-4 bg-white shadow rounded-lg">👤 Пользователи</div>
      </div>
    </main>
  );
}
