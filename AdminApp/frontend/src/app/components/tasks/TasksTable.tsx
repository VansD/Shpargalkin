// frontend/app/components/TasksTable.tsx
"use client";

import { useEffect, useState } from "react";
import EditTaskModal from "./EditTaskModal";

type Task = {
  id: number;
  title: string;
  difficulty: string;
};

type TaskResponse = {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Лёгкий");
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchTasks() {
    setLoading(true);
    const res = await fetch(`/api/tasks?q=${query}&page=${page}&limit=5`);
    const data: TaskResponse = await res.json();
    setTasks(data.data);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function addTask() {
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: newTitle, difficulty: newDifficulty }),
      headers: { "Content-Type": "application/json" },
    });
    setNewTitle("");
    fetchTasks();
  }

  async function deleteTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, [page, query]);

  if (loading) return <p>Загрузка заданий...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Задания</h2>

      {/* 🔍 Поиск */}
      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            setPage(1); // сброс на первую страницу при новом поиске
            setQuery(e.target.value);
          }}
          placeholder="Поиск по названию..."
          className="border px-2 py-1 flex-1 rounded"
        />
      </div>

      {/* Таблица */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Сложность</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="p-2 border">{task.id}</td>
              <td className="p-2 border">{task.title}</td>
              <td className="p-2 border">{task.difficulty}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => setEditTask(task)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  ❌ Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 Пагинация */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ Назад
        </button>
        <span className="px-3 py-1">
          Страница {page} из {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Вперёд ➡
        </button>
      </div>

      {/* Добавление нового задания */}
      <div className="mt-4 flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Название"
          className="border px-2 py-1 flex-1 rounded"
        />
        <select
          value={newDifficulty}
          onChange={(e) => setNewDifficulty(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option>Лёгкий</option>
          <option>Средний</option>
          <option>Сложный</option>
        </select>
        <button
          onClick={addTask}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          ➕ Добавить
        </button>
      </div>

      {/* Модалка редактирования */}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={fetchTasks}
        />
      )}
    </div>
  );
}
