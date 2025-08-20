// frontend/app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";

let tasks = [
  { id: 1, title: "Найди ошибку в тексте", difficulty: "Лёгкий" },
  { id: 2, title: "Составь правильное предложение", difficulty: "Средний" },
];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  tasks = tasks.map((t) => (t.id === id ? { ...t, ...body } : t));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  tasks = tasks.filter((t) => t.id !== id);
  return NextResponse.json({ ok: true });
}
