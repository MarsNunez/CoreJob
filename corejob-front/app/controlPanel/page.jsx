"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchJSON, getCurrentUser } from "@/lib/api";

const formatPriceShort = (value) => {
  if (value === null || value === undefined) return "S/ -";
  const num = Number(value);
  if (Number.isNaN(num)) return "S/ -";
  return `S/ ${num.toLocaleString("es-PE", { maximumFractionDigits: 0 })}`;
};

export default function ControlPanelPage() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?._id ? String(currentUser._id) : "";

  useEffect(() => {
    const load = async () => {
      if (!currentUserId) return;
      setLoading(true);
      setError("");
      try {
        const [servicesResp, bookingsResp, reviewsResp] = await Promise.all([
          fetchJSON("/services", { suppressRedirect: true }),
          fetchJSON("/bookings", { suppressRedirect: true }),
          fetchJSON("/reviews", { suppressRedirect: true }),
        ]);
        const ownServices = Array.isArray(servicesResp)
          ? servicesResp.filter(
              (s) => String(s.user_id) === String(currentUserId)
            )
          : [];
        setServices(ownServices);
        setBookings(
          Array.isArray(bookingsResp)
            ? bookingsResp.filter(
                (b) => String(b.provider_id) === String(currentUserId)
              )
            : []
        );
        setReviews(
          Array.isArray(reviewsResp)
            ? reviewsResp.filter((r) =>
                ownServices.some((s) => String(s._id) === String(r.service_id))
              )
            : []
        );
      } catch (err) {
        setError(
          err.message || "No se pudo cargar el panel de control por el momento."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUserId]);

  const stats = useMemo(() => {
    const totalServices = services.length;
    const activeServices = services.filter((s) => s.is_active).length;

    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(
      (b) => b.status === "pendiente" || b.status === "confirmada"
    ).length;

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            totalReviews
          ).toFixed(1)
        : "–";

    return {
      totalServices,
      activeServices,
      totalBookings,
      upcomingBookings,
      totalReviews,
      avgRating,
    };
  }, [services, bookings, reviews]);

  const topServices = useMemo(() => {
    return [...services]
      .sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
      .slice(0, 3);
  }, [services]);

  if (!currentUserId) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-xl flex-col gap-5 rounded-3xl border border-white/10 bg-[#0c1821] p-8 text-center">
          <p className="text-lg font-semibold">
            Inicia sesión para ver tu panel
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <i className="fa-solid fa-arrow-right-to-bracket text-xs" />
            Ir al inicio de sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Panel de control
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Vista general de tu cuenta
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Revisa el rendimiento de tus servicios y toma acción rápido.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/myservices/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500 sm:text-sm"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              Nuevo servicio
            </Link>
            <Link
              href="/myservices"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#09131d] px-4 py-2.5 text-xs font-semibold text-emerald-100 transition hover:bg-[#0f2333] sm:text-sm"
            >
              <i className="fa-solid fa-suitcase text-[10px]" />
              Ver todos mis servicios
            </Link>
          </div>
        </header>

        {error && (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* Resumen rápido */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Servicios
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.totalServices}
              <span className="ml-2 text-sm font-medium text-emerald-200">
                totales
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-300">
              {stats.activeServices} activos,{" "}
              {stats.totalServices - stats.activeServices} ocultos.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Reseñas
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.avgRating}
              <span className="ml-1 text-lg text-yellow-400">★</span>
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Basado en {stats.totalReviews} reseñas recibidas.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Reservas
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.totalBookings}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              {stats.upcomingBookings} pendientes o próximas.
            </p>
          </div>
        </section>

        {/* Servicios destacados */}
        <section className="grid gap-4 rounded-[28px] border border-white/10 bg-[#09131d] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200">
                Servicios destacados
              </p>
              <p className="text-sm text-emerald-100">
                Tus servicios mejor valorados.
              </p>
            </div>
            <Link
              href="/myservices"
              className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Ver todos
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-300">
              <i className="fa-solid fa-circle-notch animate-spin" />
              <span className="text-xs">Cargando servicios...</span>
            </div>
          ) : topServices.length === 0 ? (
            <p className="text-xs text-slate-300">
              Aún no tienes servicios con reseñas.
            </p>
          ) : (
            <ul className="space-y-3 text-xs sm:text-sm">
              {topServices.map((service) => (
                <li
                  key={service._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0f2333] px-3 py-2.5"
                >
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-semibold text-white">
                      {service.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-emerald-200">
                        <i className="fa-solid fa-star text-[9px] text-yellow-400" />
                        {service.rating_average ?? "–"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <i className="fa-solid fa-location-dot text-[9px] text-emerald-300" />
                        <span className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap">
                          {service.use_custom_location &&
                          service.service_address
                            ? service.service_address
                            : service.profile?.service_address ||
                              "Ubicación por definir"}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatPriceShort(service.price)}
                    </p>
                    <Link
                      href={`/myservices/manage/${service._id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/15 px-2 py-1 text-[11px] font-semibold text-emerald-100 hover:bg-white/5"
                    >
                      <i className="fa-solid fa-pen-to-square text-[9px]" />
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Acciones rápidas */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/profile/edit"
            className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 text-xs text-slate-200 transition hover:border-emerald-400/60 hover:bg-[#0f2333] sm:text-sm"
          >
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <i className="fa-solid fa-id-card-clip text-[0.8rem]" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Completar perfil profesional
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Añade foto, biografía, áreas de servicio y transporte.
            </p>
          </Link>

          <Link
            href="/myservices"
            className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 text-xs text-slate-200 transition hover:border-emerald-400/60 hover:bg-[#0f2333] sm:text-sm"
          >
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <i className="fa-solid fa-images text-[0.8rem]" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Mejorar fotos de servicios
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Revisa tus servicios con pocas fotos o imágenes genéricas.
            </p>
          </Link>

          <Link
            href="/profile/edit"
            className="rounded-3xl border border-white/10 bg-[#0c1821] p-4 text-xs text-slate-200 transition hover:border-emerald-400/60 hover:bg-[#0f2333] sm:text-sm"
          >
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <i className="fa-solid fa-bell text-[0.8rem]" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Revisar reseñas recientes
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Responde reseñas importantes para generar confianza.
            </p>
          </Link>
        </section>
      </div>
    </section>
  );
}

