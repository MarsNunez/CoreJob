"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

const MAX_PHOTOS = 6;
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

const normalizeSnapshot = (formState, categories, photos) => {
  const normalizedForm = {
    ...formState,
    title: String(formState.title ?? ""),
    description: String(formState.description ?? ""),
    price: String(formState.price ?? ""),
    price_type: String(formState.price_type ?? ""),
    estimated_duration: String(formState.estimated_duration ?? ""),
    service_address: String(formState.service_address ?? ""),
    service_lat:
      formState.service_lat === undefined || formState.service_lat === null
        ? ""
        : String(formState.service_lat),
    service_lng:
      formState.service_lng === undefined || formState.service_lng === null
        ? ""
        : String(formState.service_lng),
    use_custom_location: Boolean(formState.use_custom_location),
    requirements: String(formState.requirements ?? ""),
    discount_recurring: String(formState.discount_recurring ?? ""),
    materials_included: Boolean(formState.materials_included),
    discount_aplied: Boolean(formState.discount_aplied),
    is_active: Boolean(formState.is_active),
  };

  const normalizedCategories = [...categories].map(String).sort();
  const normalizedPhotos = photos
    .map((photo) => photo.trim())
    .filter(Boolean);

  return {
    form: normalizedForm,
    categories: normalizedCategories,
    photos: normalizedPhotos,
  };
};

export default function ManageServiceView() {
  const router = useRouter();
  const { service_id: serviceId } = useParams();
  const { user: currentUser, checking: authChecking } = useAuthGuard();
  const currentUserId = currentUser?._id ? String(currentUser._id) : "";
  const MapPickerModal = useMemo(
    () =>
      dynamic(() => import("@/components/MapPickerModal"), {
        ssr: false,
      }),
    []
  );
  const [form, setForm] = useState(initialForm);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [photoInputs, setPhotoInputs] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingService, setLoadingService] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [serviceOwnerId, setServiceOwnerId] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const actionsRef = useRef(null);
  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const hasAccess = Boolean(currentUser?._id);

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

  useEffect(() => {
    if (!serviceId || authChecking) return;
    let active = true;

    const loadService = async () => {
      setLoadingService(true);
      setPageError("");
      setInitialSnapshot(null);
      try {
        const data = await fetchJSON(`/services/${serviceId}`, {
          suppressRedirect: true,
        });

        if (!active) return;
        if (!data) {
          setPageError("No se encontró el servicio solicitado.");
          return;
        }

        const ownerId = String(data.user_id || "");
        if (currentUserId && ownerId && ownerId !== currentUserId) {
          setPageError("No tienes permiso para editar este servicio.");
          return;
        }

        setServiceOwnerId(ownerId);
        const loadedForm = {
          title: data.title || "",
          description: data.description || "",
          price: data.price ?? "",
          price_type: data.price_type || priceTypeOptions[0],
          estimated_duration: data.estimated_duration || "",
          use_custom_location: Boolean(data.use_custom_location),
          service_lat:
            data.service_lat !== undefined && data.service_lat !== null
              ? String(data.service_lat)
              : "",
          service_lng:
            data.service_lng !== undefined && data.service_lng !== null
              ? String(data.service_lng)
              : "",
          service_address: data.service_address || "",
          requirements: data.requirements || "",
          materials_included: Boolean(data.materials_included),
          discount_aplied: Boolean(data.discount_aplied),
          discount_recurring:
            data.discount_recurring === 0 || data.discount_recurring
              ? String(data.discount_recurring)
              : "",
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        };

        const loadedCategories =
          Array.isArray(data.categores_id)
            ? data.categores_id.map((id) => String(id))
            : [];

        const loadedPhotos =
          Array.isArray(data.photos) && data.photos.length
            ? data.photos.slice(0, MAX_PHOTOS)
            : [""];

        setForm(loadedForm);
        setSelectedCategories(loadedCategories);
        setPhotoInputs(loadedPhotos);
        setInitialSnapshot(
          normalizeSnapshot(loadedForm, loadedCategories, loadedPhotos)
        );
      } catch (err) {
        if (!active) return;
        setPageError(err.message || "No se pudo cargar el servicio.");
      } finally {
        if (active) setLoadingService(false);
      }
    };

    if (!currentUserId) return;
    loadService();
    return () => {
      active = false;
    };
  }, [serviceId, currentUserId, authChecking]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePhotoChange = (index, url) => {
    setPhotoInputs((prev) => {
      const next = [...prev];
      next[index] = url;
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

  const cleanedPhotos = useMemo(
    () =>
      photoInputs
        .map((url) => url.trim())
        .filter((url, index, array) => url && array.indexOf(url) === index),
    [photoInputs]
  );

  const validateForm = () => {
    if (!form.title.trim()) {
      setFormError("Ingresa un título para tu servicio.");
      return false;
    }
    if (!form.description.trim()) {
      setFormError("Describe tu servicio para que los clientes te conozcan.");
      return false;
    }
    const hasCustomLocation =
      form.use_custom_location &&
      ((form.service_address && form.service_address.trim().length > 0) ||
        (form.service_lat && form.service_lng));

    if (form.use_custom_location && !hasCustomLocation) {
      setFormError("Selecciona una ubicación en el mapa para este servicio.");
      return false;
    }
    if (!form.estimated_duration.trim()) {
      setFormError("Especifica una duración o rango estimado.");
      return false;
    }
    if (!selectedCategories.length) {
      setFormError("Selecciona al menos una categoría.");
      return false;
    }
    const rawPrice = String(form.price).trim();
    if (!rawPrice.length) {
      setFormError("Ingresa un precio para tu servicio.");
      return false;
    }
    const priceValue = Number(rawPrice.replace(/,/g, "."));
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setFormError("Ingresa un precio válido.");
      return false;
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
      setFormError("El descuento debe estar entre 0 y 100.");
      return false;
    }

    setFormError("");
    return {
      priceValue,
      discountValue,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasAccess) return;
    if (!serviceId) {
      setFormError("Servicio no válido.");
      return;
    }
    const validation = validateForm();
    if (!validation) return;

    const { priceValue, discountValue } = validation;
    const payload = {
      user_id: serviceOwnerId || currentUser?._id,
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

    setSaving(true);
    try {
      await fetchJSON(`/services/${serviceId}`, {
        method: "PUT",
        data: payload,
        suppressRedirect: true,
      });
      router.push("/myservices");
    } catch (err) {
      setFormError(err.message || "No se pudo actualizar el servicio.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceId) return;
    setDeleting(true);
    setFormError("");
    try {
      await fetchJSON(`/services/${serviceId}`, {
        method: "DELETE",
        suppressRedirect: true,
      });
      router.push("/myservices");
    } catch (err) {
      setFormError(err.message || "No se pudo eliminar el servicio.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const currentSnapshot = useMemo(
    () => normalizeSnapshot(form, selectedCategories, photoInputs),
    [form, selectedCategories, photoInputs]
  );

  const isDirty =
    initialSnapshot &&
    JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot);

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
            Necesitas una cuenta para editar tus servicios.
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

  if (pageError) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-xl flex-col gap-5 rounded-3xl border border-white/10 bg-[#0c1821] p-8 text-center">
          <p className="text-lg font-semibold">No se pudo cargar el servicio</p>
          <p className="text-sm text-slate-200">{pageError}</p>
          <Link
            href="/myservices"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            Volver a mis servicios
          </Link>
        </div>
      </section>
    );
  }

  if (loadingService) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#0c1821] p-8 text-center">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400" />
          <p className="text-sm text-slate-300">Cargando información del servicio...</p>
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
              Editar servicio
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">{form.title || "Servicio"}</h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Actualiza precios, categorías, fotos y disponibilidad para mantener tu servicio al día.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              form="edit-service-form"
              disabled={saving || !isDirty}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <div className="relative" ref={actionsRef}>
              <button
                type="button"
                onClick={() => setActionsOpen((open) => !open)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#0f2333] text-white transition hover:border-emerald-500/60 hover:text-emerald-200"
                aria-haspopup="menu"
                aria-expanded={actionsOpen}
              >
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
              {actionsOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b28] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                  <button
                    type="button"
                    onClick={() => {
                      setActionsOpen(false);
                      setShowDeleteModal(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-200 transition hover:bg-red-500/10"
                  >
                    <i className="fa-solid fa-trash-can text-xs" />
                    Eliminar servicio
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {formError && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {formError}
          </div>
        )}

        <form
          id="edit-service-form"
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
                        form.use_custom_location
                          ? "translate-x-5"
                          : "translate-x-1"
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
                  Puedes administrar hasta {MAX_PHOTOS} fotos por servicio.
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
      {showDeleteModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1b28] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Eliminar servicio</h3>
                <p className="mt-1 text-sm text-slate-300">
                  ¿Seguro que deseas eliminar este servicio? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar servicio"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
