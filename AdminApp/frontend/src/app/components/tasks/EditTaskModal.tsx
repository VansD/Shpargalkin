// frontend/app/components/EditTaskModal.tsx
"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  difficulty: string;
};

type Props = {
  task: Task;
  onClose: () => void;
  onSave: () => void;
};

export default function EditTaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [difficulty, setDifficulty] = useState(task.difficulty);

  async function handleSave() {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, difficulty }),
    });
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Редактировать задание</h2>

        <label className="block mb-2">
          Название:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-2 py-1 w-full rounded mt-1"
          />
        </label>

        <label className="block mb-4">
          Сложность:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border px-2 py-1 w-full rounded mt-1"
          >
            <option>Лёгкий</option>
            <option>Средний</option>
            <option>Сложный</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
