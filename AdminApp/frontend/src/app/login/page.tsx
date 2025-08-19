"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Неверный email" }),
  password: z.string().min(6, { message: "Минимум 6 символов" }),
  remember: z.boolean().optional(),
  csrfToken: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false, csrfToken: "" }
  });

  useEffect(() => {
    // fetch CSRF token from server
    fetch("/api/auth/csrf", { method: "GET", credentials: "include" })
      .then(r => r.json())
      .then(d => setValue("csrfToken", d.token))
      .catch(() => setServerError("Не удалось получить CSRF токен"));
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": data.csrfToken
      },
      credentials: "include",
      body: JSON.stringify({ email: data.email, password: data.password, remember: data.remember })
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
      return;
    }
    const payload = await res.json().catch(() => ({}));
    setServerError(payload?.message ?? "Ошибка авторизации");
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "80px auto" }}>
      <h1 style={{ marginBottom: 12 }}>Вход в админку</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input className="input" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <div className="error">{errors.email.message}</div>}

        <label>Пароль</label>
        <input className="input" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <div className="error">{errors.password.message}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 16px" }}>
          <input id="remember" type="checkbox" {...register("remember")} />
          <label htmlFor="remember">Запомнить меня</label>
        </div>

        <input type="hidden" {...register("csrfToken")} />

        <button className="button" type="submit" style={{ width: "100%" }}>Войти</button>

        {serverError && <div className="error">{serverError}</div>}
      </form>
    </div>
  );
}
