"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchJSON, setAuthSession } from "../../lib/api.js";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  role: "client",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="min-h-screen bg-[#020409] text-white">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-[#050b13] md:flex-row">
        <div className="relative hidden w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#072230,#073540,#0a4d4f,#0f5f4c)] p-12 text-white md:flex md:w-1/2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
              Crece con CoreJob
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Conecta con clientes, comparte tus servicios y haz crecer tu
              negocio.
            </h2>
            <p className="text-sm text-white/70">
              Regístrate gratis para empezar a recibir solicitudes y construir
              tu portafolio profesional.
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
              Comienza aquí
            </p>
            <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
            <p className="text-sm text-slate-300">
              Completa los campos y estarás listo en segundos.
            </p>
          </div>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              if (form.password !== form.confirmPassword) {
                setError("Las contraseñas no coinciden");
                return;
              }
              setLoading(true);
              try {
                const payload = {
                  full_name: form.fullName,
                  email: form.email,
                  phone: form.phone,
                  role: form.role,
                  password: form.password,
                };
                const data = await fetchJSON("/users", {
                  method: "POST",
                  data: payload,
                  suppressRedirect: true,
                });
                setAuthSession(data.token, data.user);
                router.push("/");
              } catch (err) {
                setError(err.message || "No se pudo registrar");
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              Nombre completo
              <input
                name="fullName"
                type="text"
                required
                className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={form.fullName}
                onChange={handleChange}
              />
            </label>

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
              ¿Cómo usarás CoreJob?
              <select
                name="role"
                className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={form.role}
                onChange={handleChange}
              >
                <option value="client">Contratar servicios</option>
                <option value="provider">Ofrecer mis servicios</option>
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
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

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                Confirmar contraseña
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(6,182,212,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-300">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
