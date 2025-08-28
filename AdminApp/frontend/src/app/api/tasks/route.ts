// frontend/app/api/tasks/route.ts
import { NextResponse } from "next/server";

const tasks = [
  { id: 1, title: "Найди ошибку в тексте", difficulty: "Лёгкий" },
  { id: 2, title: "Составь правильное предложение", difficulty: "Средний" },
  { id: 3, title: "Разбери предложение по членам", difficulty: "Сложный" },
  { id: 4, title: "Исправь орфографические ошибки", difficulty: "Лёгкий" },
  { id: 5, title: "Определи часть речи", difficulty: "Средний" },
  // ...можно нагенерить для теста
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.toLowerCase() || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "5");

  // фильтрация
  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(q));

  // пагинация
  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
