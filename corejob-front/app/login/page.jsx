"use client";

import Link from "next/link";
import { useState } from "react";

const initialState = {
  email: "",
  password: "",
  remember: true,
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login data", form);
  };

  return (
    <section className="min-h-screen bg-[#020409] text-white">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-[#050b13] md:flex-row">
        <div className="relative hidden w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#0f5f4c,#0a4d4f,#073540,#072230)] p-12 text-white md:flex md:w-1/2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
              A new way to collaborate
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Gestiona mensajes, reservas y clientes desde un solo lugar.
            </h2>
            <p className="text-sm text-white/70">
              Inicia sesión para continuar conectando con clientes y seguir
              creciendo.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center bg-[#090f1a] px-8 py-12 md:w-1/2 md:px-16">
          <Link
            href="/"
            className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white hover:bg-white/10"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
              Bienvenido
            </p>
            <h1 className="text-3xl font-bold text-white">
              Ingresa a tu cuenta
            </h1>
            <p className="text-sm text-slate-300">
              Escribe tus credenciales para continuar.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              Correo electrónico
              <input
                name="email"
                type="email"
                required
                className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              Contraseña
              <input
                name="password"
                type="password"
                required
                className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={form.password}
                onChange={handleChange}
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 accent-emerald-600"
                />
                Recuérdame
              </label>
              <button
                type="button"
                className="text-emerald-300 hover:text-emerald-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(6,182,212,0.35)] transition hover:opacity-90"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
