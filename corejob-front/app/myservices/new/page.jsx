"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { fetchJSON } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const priceTypeOptions = [
  "precio fijo",
  "por hora",
  "por sesion",
  "por metro cuadrado",
  "por dia",
  "por unidad",
  "por persona",
  "por proyecto",
];

const initialForm = {
  title: "",
  description: "",
  price: "",
  price_type: priceTypeOptions[0],
  estimated_duration: "",
  use_custom_location: false,
  service_lat: "",
  service_lng: "",
  service_address: "",
  requirements: "",
  materials_included: false,
  discount_aplied: false,
  discount_recurring: "",
  is_active: true,
};

const MAX_PHOTOS = 6;
const emptyPhotoList = ["", "", ""];

export default function NewServicePage() {
  const router = useRouter();
  const { user: currentUser, checking: authChecking } = useAuthGuard();
  const MapPickerModal = useMemo(
    () =>
      dynamic(() => import("@/components/MapPickerModal"), {
        ssr: false,
      }),
    []
  );
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [photoInputs, setPhotoInputs] = useState(emptyPhotoList);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setCatalogError("");
      try {
        const data = await fetchJSON("/categories", { suppressRedirect: true });
        setCategories(data || []);
      } catch (err) {
        setCatalogError(
          err.message || "No se pudieron cargar las categorías disponibles."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (index, value) => {
    setPhotoInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addPhotoField = () => {
    setPhotoInputs((prev) => {
      if (prev.length >= MAX_PHOTOS) return prev;
      return [...prev, ""];
    });
  };

  const removePhotoField = (index) => {
    setPhotoInputs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId]
    );
  };

  const hasAccess = Boolean(currentUser?._id);

  const cleanedPhotos = useMemo(
    () =>
      photoInputs
        .map((url) => url.trim())
        .filter((url, index, array) => url && array.indexOf(url) === index),
    [photoInputs]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!hasAccess) {
      setError("Debes iniciar sesión para crear un servicio.");
      return;
    }

    if (!form.title.trim()) {
      setError("Ingresa un título para tu servicio.");
      return;
    }

    if (!form.description.trim()) {
      setError("Describe tu servicio para que los clientes te conozcan.");
      return;
    }

    const hasCustomLocation =
      form.use_custom_location &&
      ((form.service_address && form.service_address.trim().length > 0) ||
        (form.service_lat && form.service_lng));

    if (form.use_custom_location && !hasCustomLocation) {
      setError("Selecciona una ubicación en el mapa para este servicio.");
      return;
    }

    if (!form.estimated_duration.trim()) {
      setError("Especifica una duración o rango estimado.");
      return;
    }

    if (!selectedCategories.length) {
      setError("Selecciona al menos una categoría.");
      return;
    }

    const rawPrice = String(form.price).trim();
    if (!rawPrice.length) {
      setError("Ingresa un precio para tu servicio.");
      return;
    }

    const priceValue = Number(rawPrice.replace(/,/g, "."));
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError("Ingresa un precio válido.");
      return;
    }

    const discountValue = form.discount_aplied
      ? Number(String(form.discount_recurring).trim())
      : 0;

    if (
      form.discount_aplied &&
      (String(form.discount_recurring).trim() === "" ||
        Number.isNaN(discountValue) ||
        discountValue < 0 ||
        discountValue > 100)
    ) {
      setError("El descuento debe estar entre 0 y 100.");
      return;
    }

    const payload = {
      user_id: currentUser._id,
      title: form.title.trim(),
      description: form.description.trim(),
      price_type: form.price_type,
      price: priceValue,
      estimated_duration: form.estimated_duration.trim(),
      use_custom_location: !!form.use_custom_location,
      service_lat:
        form.use_custom_location && form.service_lat !== ""
          ? Number(form.service_lat)
          : undefined,
      service_lng:
        form.use_custom_location && form.service_lng !== ""
          ? Number(form.service_lng)
          : undefined,
      service_address:
        form.use_custom_location && form.service_address
          ? form.service_address.trim()
          : "",
      requirements: form.requirements.trim(),
      materials_included: form.materials_included,
      discount_aplied: form.discount_aplied,
      discount_recurring: discountValue,
      is_active: form.is_active,
      categores_id: selectedCategories,
      photos: cleanedPhotos,
    };

    setSubmitting(true);
    try {
      await fetchJSON("/services", {
        method: "POST",
        data: payload,
        suppressRedirect: true,
      });
      router.push("/myservices");
    } catch (err) {
      setError(err.message || "No se pudo crear el servicio. Intenta más tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#0c1821] p-8 text-center">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400" />
          <p className="text-sm text-slate-200">Verificando sesión...</p>
        </div>
      </section>
    );
  }

  if (!hasAccess) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-xl flex-col gap-5 rounded-3xl border border-white/10 bg-[#0c1821] p-8 text-center">
          <p className="text-lg font-semibold">Inicia sesión para continuar</p>
          <p className="text-sm text-slate-200">
            Necesitas una cuenta para publicar nuevos servicios en CoreJob.
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
        <Link
          href="/myservices"
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-[#09131d] px-4 py-2 text-sm text-emerald-100 transition hover:bg-[#0f2333]"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Volver a mis servicios
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Nuevo servicio
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Crea tu próxima oferta
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Describe tu trabajo, carga fotos inspiradoras y publica tu servicio en minutos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/myservices")}
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="new-service-form"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Guardando..." : "Publicar servicio"}
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <form
          id="new-service-form"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Título del servicio
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Servicio de pintura ecológica"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Modalidad de precio
                <select
                  name="price_type"
                  value={form.price_type}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                >
                  {priceTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Precio estimado
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={form.price}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. 250"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Duración estimada
                <input
                  type="text"
                  name="estimated_duration"
                  value={form.estimated_duration}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. 4 horas"
                />
              </label>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1b28] p-4 text-sm text-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    Usar ubicación específica para este servicio
                  </p>
                  <p className="text-xs text-slate-400">
                    Si lo activas, este servicio aparecerá en el mapa según la
                    ubicación que definas aquí y no según tu perfil.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      use_custom_location: !prev.use_custom_location,
                    }))
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition flex-shrink-0 ${
                    form.use_custom_location
                      ? "bg-emerald-500"
                      : "bg-slate-500/60"
                  }`}
                  aria-pressed={form.use_custom_location}
                >
                  <span className="sr-only">
                    Alternar ubicación específica del servicio
                  </span>
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                      form.use_custom_location ? "translate-x-5" : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>
              {form.use_custom_location && (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-[#0a1f2b] px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 hover:bg-[#0f2a3a]"
                  >
                    <i className="fa-solid fa-map-location-dot text-[0.7rem]" />
                    Seleccionar ubicación en el mapa
                  </button>
                  <p className="text-xs text-slate-400">
                    {form.service_address
                      ? form.service_address
                      : form.service_lat && form.service_lng
                      ? `Coordenadas seleccionadas: ${form.service_lat}, ${form.service_lng}`
                      : "Aún no has seleccionado una ubicación precisa para este servicio."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1b28] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Categorías
              </p>
              {loadingCategories ? (
                <p className="text-sm text-slate-300">Cargando categorías...</p>
              ) : catalogError ? (
                <p className="text-sm text-red-200">{catalogError}</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-slate-300">
                  No hay categorías disponibles por el momento.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2 text-sm ${
                        selectedCategories.includes(category._id)
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/10 bg-[#0f2333]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-emerald-500"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => toggleCategory(category._id)}
                      />
                      <span className="text-slate-100">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Descripción del servicio
              <textarea
                name="description"
                rows={6}
                value={form.description}
                onChange={handleFormChange}
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                placeholder="Explica tu experiencia, proceso y qué incluye el servicio."
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Requerimientos para el cliente
              <textarea
                name="requirements"
                rows={4}
                value={form.requirements}
                onChange={handleFormChange}
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                placeholder="Materiales, accesos o información necesaria para comenzar."
              />
            </label>
          </div>

          <aside className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Galería
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {photoInputs.map((photo, index) => (
                  <div
                    key={`photo-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1b28] px-3 py-2"
                  >
                    <input
                      type="url"
                      value={photo}
                      onChange={(event) =>
                        handlePhotoChange(index, event.target.value)
                      }
                      placeholder="URL de la imagen"
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    {photoInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhotoField(index)}
                        className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-200 transition hover:bg-red-500/30"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhotoField}
                  disabled={photoInputs.length >= MAX_PHOTOS}
                  className="rounded-2xl border border-dashed border-emerald-500/40 px-4 py-2 text-sm text-emerald-200 transition hover:bg-[#0d1b28] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {photoInputs.length >= MAX_PHOTOS
                    ? "Máximo de 6 enlaces alcanzado"
                    : "+ Añadir enlace de foto"}
                </button>
                <p className="text-xs text-slate-400">
                  Puedes agregar hasta {MAX_PHOTOS} fotos. Más adelante
                  podrás subirlas directamente.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-sm text-slate-200">
                <div>
                  <p className="font-semibold">Materiales incluidos</p>
                  <p className="text-xs text-slate-400">
                    Marca si provees herramientas o insumos esenciales.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="materials_included"
                  checked={form.materials_included}
                  onChange={handleFormChange}
                  className="h-5 w-5 accent-emerald-500"
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#0d1b28] p-4 text-sm text-slate-200">
                <label className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Aplicar descuento</p>
                    <p className="text-xs text-slate-400">
                      Ideal para clientes recurrentes o combos.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="discount_aplied"
                    checked={form.discount_aplied}
                    onChange={handleFormChange}
                    className="h-5 w-5 accent-emerald-500"
                  />
                </label>
                {form.discount_aplied && (
                  <div className="mt-3">
                    <input
                      type="number"
                      name="discount_recurring"
                      value={form.discount_recurring}
                      min="0"
                      max="100"
                      onChange={handleFormChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#0f2333] px-3 py-2 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                      placeholder="Porcentaje de descuento"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Ingresa un valor entre 0% y 100%.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d1b28] p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                  Estado del servicio
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { label: "Activo", value: true },
                    { label: "Oculto", value: false },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className="flex items-center gap-3 rounded-xl bg-[#0f2333] px-3 py-2"
                    >
                      <input
                        type="radio"
                        name="is_active"
                        value={String(option.value)}
                        checked={form.is_active === option.value}
                        onChange={() =>
                          setForm((prev) => ({
                            ...prev,
                            is_active: option.value,
                          }))
                        }
                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
      <MapPickerModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={({ address, lat, lng }) => {
          setForm((prev) => ({
            ...prev,
            service_address: address || prev.service_address,
            service_lat: lat !== undefined ? String(lat) : prev.service_lat,
            service_lng: lng !== undefined ? String(lng) : prev.service_lng,
          }));
          setLocationModalOpen(false);
        }}
        initialPosition={
          form.service_lat && form.service_lng
            ? [Number(form.service_lat), Number(form.service_lng)]
            : undefined
        }
        initialAddress={form.service_address || ""}
      />
    </section>
  );
}
