"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import Filter from "@/components/Filter";
import ServiceQuickViewModal from "@/components/ServiceQuickViewModal";

const SearchMapView = dynamic(
  () => import("@/components/SearchMapView"),
  { ssr: false }
);
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

const toRad = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function SearchView() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    categoryIds: [],
    country: "",
    department: "",
    maxPrice: "",
    minRating: null,
    maxDistanceKm: null,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedService, setSelectedService] = useState(null);

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
  const requestUserLocation = () => {
    if (userLocation || locating) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError(
        "Tu navegador no soporta geolocalización; el filtro de distancia no se aplicará."
      );
      return;
    }

    let cancelled = false;
    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        if (cancelled) return;
        setLocationError(
          "No pudimos obtener tu ubicación; el filtro de distancia no se aplicará."
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    if (!activeFilters.maxDistanceKm) return;
    requestUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters.maxDistanceKm]);

  useEffect(() => {
    if (viewMode !== "map") return;
    if (userLocation || locating || locationError) return;
    requestUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, userLocation, locating, locationError]);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    const {
      categoryIds,
      country,
      department,
      maxPrice,
      minRating,
      maxDistanceKm,
    } = activeFilters;

    return services.filter((service) => {
      const title = String(service.title || "").toLowerCase();
      if (q && !title.includes(q)) {
        return false;
      }

      const owner = service.user || null;
      const profile = service.profile || null;

      if (Array.isArray(categoryIds) && categoryIds.length) {
        const serviceCategoryIds = Array.isArray(service.categores_id)
          ? service.categores_id.map((id) => String(id))
          : [];
        const hasCategory = categoryIds.some((id) =>
          serviceCategoryIds.includes(String(id))
        );
        if (!hasCategory) return false;
      }

      if (country && owner?.location_country !== country) {
        return false;
      }

      if (department && owner?.location_department !== department) {
        return false;
      }

      const priceValue =
        service.price === null || service.price === undefined
          ? null
          : Number(service.price);
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!Number.isNaN(max)) {
          if (priceValue === null || priceValue > max) return false;
        }
      }

      if (minRating) {
        const rating =
          profile?.rating_average === null ||
          profile?.rating_average === undefined
            ? null
            : Number(profile.rating_average);
        if (rating === null || Number.isNaN(rating) || rating < minRating) {
          return false;
        }
      }

      if (maxDistanceKm && userLocation) {
        const serviceLat = profile?.service_lat;
        const serviceLng = profile?.service_lng;
        if (
          typeof serviceLat !== "number" ||
          Number.isNaN(serviceLat) ||
          typeof serviceLng !== "number" ||
          Number.isNaN(serviceLng)
        ) {
          return false;
        }
        const distanceKm = haversineDistanceKm(
          userLocation.lat,
          userLocation.lng,
          serviceLat,
          serviceLng
        );
        if (distanceKm > maxDistanceKm) return false;
      }

      return true;
    });
  }, [services, query, activeFilters]);

  return (
    <section className="p-5">
      <Filter onApplyFilters={setActiveFilters} />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="border w-fit border-[#065f46] my-1 rounded-md px-2 py-1 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none bg-transparent text-white placeholder:text-slate-400"
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#031e1a] p-1 text-xs text-emerald-50">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-100/80 hover:bg-white/5"
              }`}
            >
              <i className="fa-solid fa-grip"></i>
              <span>Lista</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                viewMode === "map"
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-100/80 hover:bg:white/5 hover:bg-white/5"
              }`}
            >
              <i className="fa-solid fa-map"></i>
              <span>Mapa</span>
            </button>
          </div>
        </div>

        {activeFilters.maxDistanceKm && !userLocation && (
          <p className="mb-3 text-xs text-amber-300">
            {locating
              ? "Obteniendo tu ubicación para aplicar el filtro de distancia..."
              : locationError ||
                "Activa los permisos de ubicación en tu navegador para aplicar el filtro de distancia."}
          </p>
        )}

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
          <>
            {viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-6xl mx-auto w-fit">
                {filteredServices.map((service) => {
                  const gallery = Array.isArray(service.photos)
                    ? service.photos
                    : [];
                  const firstImage =
                    gallery.find((url) => url && url.trim()) || undefined;
                  const categoryNames = Array.isArray(service.categories)
                    ? service.categories
                        .map((cat) => cat?.name)
                        .filter(Boolean)
                    : [];

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
                  const providerHref = ownerId
                    ? `/profile/${ownerId}`
                    : undefined;

                  return (
                    <Card
                      key={service._id}
                      imageSrc={firstImage}
                      badgeRight={service.location || ""}
                      title={service.title || "Servicio"}
                      provider={provider}
                      providerHref={providerHref}
                      categories={categoryNames}
                      priceLabel="Precio:"
                      priceValue={formatPrice(
                        service.price,
                        service.price_type
                      )}
                      durationLabel="Duración:"
                      durationValue={
                        service.estimated_duration || "No especificada"
                      }
                      gallery={gallery}
                    />
                  );
                })}
              </div>
            ) : (
              <SearchMapView
                services={filteredServices}
                userLocation={userLocation}
                formatPrice={formatPrice}
                onSelectService={(service) => setSelectedService(service)}
              />
            )}
            <ServiceQuickViewModal
              open={Boolean(selectedService)}
              service={selectedService}
              provider={
                selectedService
                  ? {
                      ...DEFAULT_PROVIDER,
                      name:
                        selectedService.user_name ||
                        selectedService.user?.full_name ||
                        selectedService.user?.name ||
                        DEFAULT_PROVIDER.name,
                      avatar:
                        selectedService.user_avatar ||
                        selectedService.profile?.profile_picture ||
                        selectedService.user?.profile_picture ||
                        DEFAULT_PROVIDER.avatar,
                    }
                  : DEFAULT_PROVIDER
              }
              priceLabel="Precio:"
              priceValue={
                selectedService
                  ? formatPrice(
                      selectedService.price,
                      selectedService.price_type
                    )
                  : ""
              }
              durationLabel="Duración:"
              durationValue={
                selectedService?.estimated_duration || "No especificada"
              }
              gallery={
                selectedService && Array.isArray(selectedService.photos)
                  ? selectedService.photos
                  : []
              }
              onClose={() => setSelectedService(null)}
            />
          </>
        )}
      </div>
    </section>
  );
}
