"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import Filter from "@/components/Filter";
import { fetchJSON } from "@/lib/api";

const DEFAULT_PROVIDER = {
  name: "Proveedor",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
  rating: 5,
  reviews: 12,
};

const formatPrice = (price, priceType) => {
  if (price === null || price === undefined || price === "") return "No especificado";
  const value = Number(price);
  if (Number.isNaN(value)) return "No especificado";
  const formatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(value)}${priceType ? ` / ${priceType}` : ""}`;
};

export default function SearchView() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJSON("/services", { suppressRedirect: true });
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((service) => {
      const title = String(service.title || "").toLowerCase();
      const desc = String(service.description || "").toLowerCase();
      const location = String(service.location || "").toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        location.includes(q)
      );
    });
  }, [query, services]);

  return (
    <section className="p-5">
      <Filter />
      <div className="max-w-6xl mx-auto">
        <div className="border w-fit border-[#065f46] my-5 rounded-md px-2 py-1 flex items-center gap-2">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none bg-transparent text-white placeholder:text-slate-400"
          />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-300">
            <i className="fa-solid fa-circle-notch animate-spin"></i>
            <span>Cargando servicios...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : filteredServices.length === 0 ? (
          <p className="text-slate-300">No se encontraron servicios.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-6xl mx-auto w-fit">
            {filteredServices.map((service) => {
              const gallery = Array.isArray(service.photos)
                ? service.photos
                : [];
              const firstImage =
                gallery.find((url) => url && url.trim()) || undefined;

              const ownerId =
                service.user_id ||
                service.user?._id ||
                service.user?.id ||
                service.userId;
              const owner = service.user || service.owner || null;
              const profile = service.profile || null;
              const provider = {
                ...DEFAULT_PROVIDER,
                name:
                  service.user_name ||
                  owner?.full_name ||
                  owner?.name ||
                  service.user?.full_name ||
                  service.user?.name ||
                  DEFAULT_PROVIDER.name,
                avatar:
                  service.user_avatar ||
                  profile?.profile_picture ||
                  owner?.profile_picture ||
                  owner?.avatar ||
                  service.user?.profile_picture ||
                  service.user?.avatar ||
                  DEFAULT_PROVIDER.avatar,
              };
              const providerHref = ownerId ? `/profile/${ownerId}` : undefined;

              return (
                <Card
                  key={service._id}
                  imageSrc={firstImage}
                  badgeLeft={service.price_type || "Servicio"}
                  badgeRight={service.location || ""}
                  title={service.title || "Servicio"}
                  provider={provider}
                  providerHref={providerHref}
                  priceLabel="Precio:"
                  priceValue={formatPrice(service.price, service.price_type)}
                  durationLabel="Duración:"
                  durationValue={service.estimated_duration || "No especificada"}
                  gallery={gallery}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
