"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ServiceCard from "@/components/ServiceCard.jsx";
import { fetchJSON, getCurrentUser } from "@/lib/api";

const formatPrice = (value) => {
  if (typeof value !== "number") return value || "S/ -";
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `€${value}`;
  }
};

export default function MyServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?._id) {
      router.replace("/login");
      return;
    }
    setCurrentUserId(String(user._id));
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!currentUserId) return;
    let active = true;

    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJSON("/services", { suppressRedirect: true });
        const filtered = data.filter(
          (service) => String(service.user_id) === String(currentUserId)
        );
        if (active) {
          setServices(filtered);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "No se pudieron obtener tus servicios. Intenta más tarde."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, [currentUserId]);

  const cards = useMemo(
    () =>
      services.map((service) => ({
        id: service._id,
        title: service.title,
        variant: service.price_type || "Servicio",
        rating: service.rating_average ?? 0,
        joined: service.createdAt
          ? new Date(service.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Sin fecha",
        location: service.location || "Ubicación por definir",
        schedule: service.estimated_duration || "Duración flexible",
        price: formatPrice(service.price),
        priceUnit: service.price_type || "",
        photo:
          service.photos?.[0] ||
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
      })),
    [services]
  );

  if (!authChecked && !currentUserId) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400" />
          <p className="text-sm text-slate-300">Verificando acceso...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-200">
              Mis servicios
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Gestiona tus publicaciones
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Actualiza precios, disponibilidad y revisa el rendimiento.
            </p>
          </div>
          <Link
            href="/myservices/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Nuevo servicio
          </Link>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#0c1821] p-10 text-center text-slate-300">
            <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400"></i>
            <p className="mt-4 text-sm">Cargando tus servicios...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-100">
            {error}
          </div>
        ) : cards.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0c1821] p-10 text-center text-slate-300">
            Aún no tienes servicios creados. Usa el botón “Nuevo servicio” para empezar.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {cards.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
