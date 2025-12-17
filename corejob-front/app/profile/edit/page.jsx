"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PERU_DEPARTMENTS } from "@/constants/peruLocations";
import { PRICE_CURRENCIES, PRICE_CURRENCY_MAP } from "@/constants/currencies";
import { fetchJSON, getCurrentUser, getToken, setAuthSession } from "@/lib/api";
import twemoji from "twemoji";

const getCurrencyFlagUrl = (emoji) => {
  if (!emoji) return "";
  const codePoint = twemoji.convert.toCodePoint(emoji);
  return `https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`;
};

export default function EditProfilePage() {
  const router = useRouter();
  const MapPickerModal = useMemo(
    () =>
      dynamic(() => import("@/components/MapPickerModal"), {
        ssr: false,
      }),
    []
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location_country: "Perú",
    location_department: "",
    phone_public: true,
    password: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    profile_picture: "",
    service_map_url: "",
    service_address: "",
    service_radius_value: "",
    service_radius_unit: "km",
    service_price_min: "",
    service_price_max: "",
    service_price_currency: "PEN",
    service_price_enabled: false,
    service_transport: "",
    service_response_time: "",
    service_emergency: "",
    service_lat: "",
    service_lng: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  // Guard + initial fetch
  useEffect(() => {
    const user = getCurrentUser();
    if (!user?._id) {
      router.replace("/login");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      setError("");
      try {
        const [categoriesResp, profilesResp] = await Promise.all([
          fetchJSON("/categories", { suppressRedirect: true }),
          fetchJSON("/profiles", { suppressRedirect: true }),
        ]);

        const matchedProfile =
          profilesResp.find(
            (profile) => String(profile.user_id) === String(currentUser._id)
          ) || null;

        setCategories(categoriesResp || []);
        setProfileId(matchedProfile?._id || "");

        setUserForm((prev) => ({
          ...prev,
          full_name: currentUser.full_name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          location_country: currentUser.location_country || "Perú",
          location_department:
            currentUser.location_department || currentUser.location_city || "",
          phone_public:
            typeof currentUser.phone_public === "boolean"
              ? currentUser.phone_public
              : true,
        }));

        if (matchedProfile) {
          const hasManualPrice =
            typeof matchedProfile.service_price_min === "number" ||
            typeof matchedProfile.service_price_max === "number";
          setProfileForm({
            bio: matchedProfile.bio || "",
            profile_picture: matchedProfile.profile_picture || "",
            service_map_url: matchedProfile.service_map_url || "",
            service_address: matchedProfile.service_address || "",
            service_radius_value:
              matchedProfile.service_radius_value !== undefined
                ? String(matchedProfile.service_radius_value)
                : "",
            service_radius_unit: matchedProfile.service_radius_unit || "km",
            service_price_min:
              matchedProfile.service_price_min !== undefined
                ? String(matchedProfile.service_price_min)
                : "",
            service_price_max:
              matchedProfile.service_price_max !== undefined
                ? String(matchedProfile.service_price_max)
                : "",
            service_price_currency:
              matchedProfile.service_price_currency || "PEN",
            service_price_enabled: hasManualPrice,
            service_transport: matchedProfile.service_transport || "",
            service_response_time: matchedProfile.service_response_time || "",
            service_emergency: matchedProfile.service_emergency || "",
            service_lat:
              matchedProfile.service_lat !== undefined
                ? String(matchedProfile.service_lat)
                : "",
            service_lng:
              matchedProfile.service_lng !== undefined
                ? String(matchedProfile.service_lng)
                : "",
          });
          setSelectedCategories(
            Array.isArray(matchedProfile.categories)
              ? matchedProfile.categories.map((id) => String(id))
              : []
          );
        }
      } catch (err) {
        setError(err.message || "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const disableSubmit = useMemo(
    () => saving || !currentUser?._id,
    [saving, currentUser]
  );

  const selectedCurrency = useMemo(
    () =>
      PRICE_CURRENCY_MAP[profileForm.service_price_currency] ||
      PRICE_CURRENCY_MAP.PEN,
    [profileForm.service_price_currency]
  );

  const currencyFlagUrl = useMemo(
    () => getCurrencyFlagUrl(selectedCurrency?.emoji),
    [selectedCurrency]
  );

  const handleCurrencySelect = (code) => {
    setProfileForm((prev) => ({ ...prev, service_price_currency: code }));
    setCurrencyOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target)
      ) {
        setCurrencyOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setCurrencyOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setCurrencyOpen(false);
  }, [profileForm.service_price_currency]);

  const computedMapUrl = useMemo(() => {
    if (profileForm.service_map_url.trim())
      return profileForm.service_map_url.trim();
    if (profileForm.service_lat && profileForm.service_lng) {
      return `https://www.google.com/maps?q=${profileForm.service_lat},${profileForm.service_lng}&output=embed`;
    }
    if (profileForm.service_address.trim()) {
      const q = encodeURIComponent(profileForm.service_address.trim());
      return `https://www.google.com/maps?q=${q}&output=embed`;
    }
    return "";
  }, [
    profileForm.service_map_url,
    profileForm.service_address,
    profileForm.service_lat,
    profileForm.service_lng,
  ]);

  const storedMapPosition = useMemo(() => {
    const lat = parseFloat(profileForm.service_lat);
    const lng = parseFloat(profileForm.service_lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }
    return null;
  }, [profileForm.service_lat, profileForm.service_lng]);

  const handleMapConfirm = ({ address, mapUrl, lat, lng }) => {
    setProfileForm((prev) => ({
      ...prev,
      service_address: address || prev.service_address,
      service_map_url: mapUrl || prev.service_map_url,
      service_lat: lat !== undefined ? String(lat) : prev.service_lat,
      service_lng: lng !== undefined ? String(lng) : prev.service_lng,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?._id) return;
    setSaving(true);
    setError("");
    setPriceError("");

    if (userForm.password && userForm.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setSaving(false);
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setSaving(false);
      return;
    }

    if (profileForm.service_price_enabled) {
      const minPriceValue = profileForm.service_price_min.trim();
      const maxPriceValue = profileForm.service_price_max.trim();
      if (minPriceValue && Number(minPriceValue) < 0) {
        setPriceError("El precio mínimo no puede ser negativo.");
        setSaving(false);
        return;
      }
      if (maxPriceValue && Number(maxPriceValue) < 0) {
        setPriceError("El precio máximo no puede ser negativo.");
        setSaving(false);
        return;
      }
      if (
        minPriceValue &&
        maxPriceValue &&
        Number(minPriceValue) > Number(maxPriceValue)
      ) {
        setPriceError("El precio mínimo no puede ser mayor que el máximo.");
        setSaving(false);
        return;
      }
    }

    const userPayload = {
      full_name: userForm.full_name.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      location_country: (userForm.location_country || "Perú").trim(),
      location_department: userForm.location_department.trim(),
      phone_public: !!userForm.phone_public,
      ...(userForm.password ? { password: userForm.password } : {}),
    };

    const profilePayload = {
      user_id: currentUser._id,
      bio: profileForm.bio.trim(),
      profile_picture: profileForm.profile_picture.trim(),
      categories: selectedCategories,
      service_map_url: computedMapUrl,
      service_address: profileForm.service_address.trim(),
      service_lat:
        profileForm.service_lat === ""
          ? undefined
          : Number(profileForm.service_lat),
      service_lng:
        profileForm.service_lng === ""
          ? undefined
          : Number(profileForm.service_lng),
      service_radius_value:
        profileForm.service_radius_value === ""
          ? undefined
          : Number(profileForm.service_radius_value),
      service_radius_unit: profileForm.service_radius_unit || "km",
      service_price_min:
        profileForm.service_price_enabled &&
        profileForm.service_price_min !== ""
          ? Number(profileForm.service_price_min)
          : null,
      service_price_max:
        profileForm.service_price_enabled &&
        profileForm.service_price_max !== ""
          ? Number(profileForm.service_price_max)
          : null,
      service_price_currency: profileForm.service_price_currency || "PEN",
      service_transport: profileForm.service_transport.trim(),
      service_response_time: profileForm.service_response_time.trim(),
      service_emergency: profileForm.service_emergency.trim(),
    };

    try {
      const updatedUser = await fetchJSON(`/users/${currentUser._id}`, {
        method: "PUT",
        data: userPayload,
        suppressRedirect: true,
      });

      if (profileId) {
        await fetchJSON(`/profiles/${profileId}`, {
          method: "PUT",
          data: profilePayload,
          suppressRedirect: true,
        });
      } else {
        const createdProfile = await fetchJSON("/profiles", {
          method: "POST",
          data: profilePayload,
          suppressRedirect: true,
        });
        setProfileId(createdProfile?._id || "");
      }

      setAuthSession(getToken(), updatedUser);
      router.push(`/profile/${currentUser._id}`);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser?._id && loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400" />
          <p className="text-sm text-slate-300">Cargando perfil...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Link
          href={`/profile/${currentUser?._id || ""}`}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1621] px-4 py-2 text-sm text-emerald-100 transition hover:bg-[#102132]"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Volver a mi perfil
        </Link>

        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
            Editar Perfil
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Actualiza tu información
          </h1>
          <p className="text-sm text-emerald-100 sm:text-base">
            Cambia tus datos de cuenta y lo que muestras en tu perfil.
          </p>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <form
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Nombre completo
                <input
                  type="text"
                  name="full_name"
                  value={userForm.full_name}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Teléfono
                <input
                  type="text"
                  name="phone"
                  value={userForm.phone}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                />
              </label>
              <div className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Mostrar teléfono públicamente
                    </p>
                    <p className="text-xs text-slate-400">
                      Controla si aparecerá en el contacto directo de tu perfil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUserForm((prev) => ({
                        ...prev,
                        phone_public: !prev.phone_public,
                      }))
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      userForm.phone_public
                        ? "bg-emerald-500"
                        : "bg-slate-500/60"
                    }`}
                    aria-pressed={userForm.phone_public}
                  >
                    <span className="sr-only">
                      Alternar visibilidad del teléfono
                    </span>
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                        userForm.phone_public
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                País
                <select
                  name="location_country"
                  value={userForm.location_country || "Perú"}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                >
                  <option value="Perú">Perú</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Departamento
                <select
                  name="location_department"
                  value={userForm.location_department}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                >
                  <option value="">Selecciona un departamento</option>
                  {PERU_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Nueva contraseña
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Dejar vacío para no cambiar"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Confirmar contraseña
                <input
                  type="password"
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Repite la contraseña"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Foto de perfil (URL)
              <input
                type="url"
                name="profile_picture"
                value={profileForm.profile_picture}
                onChange={handleProfileChange}
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                placeholder="https://..."
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Biografía
              <textarea
                name="bio"
                rows={5}
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                placeholder="Cuenta tu experiencia, servicios y enfoque."
              />
            </label>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1b28] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Categorías
              </p>
              {categories.length === 0 ? (
                <p className="text-sm text-slate-300">
                  No hay categorías disponibles por el momento.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2 text-sm ${
                        selectedCategories.includes(String(category._id))
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/10 bg-[#0f2333]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-emerald-500"
                        checked={selectedCategories.includes(
                          String(category._id)
                        )}
                        onChange={() => toggleCategory(String(category._id))}
                      />
                      <span className="text-slate-100">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Ubicación y área de servicio
              </p>
              <button
                type="button"
                onClick={() => setMapModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/10"
              >
                <i className="fa-solid fa-map-location-dot"></i>
                Abrir mapa interactivo
              </button>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="flex items-center gap-2 font-semibold text-white/90">
                  <i className="fa-solid fa-location-dot text-emerald-400"></i>
                  Dirección
                </span>
                <input
                  type="text"
                  name="service_address"
                  value={profileForm.service_address}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Calle, ciudad, país."
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                URL del mapa (embed)
                <input
                  type="url"
                  name="service_map_url"
                  value={profileForm.service_map_url}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="https://www.google.com/maps/embed?... (opcional)"
                />
                <p className="text-xs text-slate-400">
                  Si lo dejas vacío generaremos el mapa con la dirección.
                </p>
              </label>
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="flex items-center gap-2 font-semibold text-white/90">
                    <i className="fa-solid fa-paper-plane text-emerald-400"></i>
                    Radio de servicio
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="service_radius_value"
                    value={profileForm.service_radius_value}
                    onChange={handleProfileChange}
                    className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                    placeholder="Ej. 25"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Unidad
                  <select
                    name="service_radius_unit"
                    value={profileForm.service_radius_unit}
                    onChange={handleProfileChange}
                    className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  >
                    <option value="km">Km</option>
                    <option value="m">Metros</option>
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Tipo de moneda preferida
                <div className="relative" ref={currencyDropdownRef}>
                  <input
                    type="hidden"
                    name="service_price_currency"
                    value={profileForm.service_price_currency}
                  />
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen((open) => !open)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-left text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40 ${
                      currencyFlagUrl ? "pl-3" : ""
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={currencyOpen}
                  >
                    <span className="flex items-center gap-3">
                      {currencyFlagUrl ? (
                        <img
                          src={currencyFlagUrl}
                          alt=""
                          aria-hidden="true"
                          className="h-5 w-5 flex-shrink-0 rounded-[6px] bg-[#0d1b28]"
                          loading="lazy"
                        />
                      ) : null}
                      <span>{selectedCurrency?.label || "Selecciona"}</span>
                    </span>
                    <i
                      className={`fa-solid fa-chevron-down text-xs transition ${
                        currencyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {currencyOpen ? (
                    <ul
                      className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b28] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                      role="listbox"
                    >
                      {PRICE_CURRENCIES.map((currency) => {
                        const optionFlag = getCurrencyFlagUrl(currency.emoji);
                        const isSelected =
                          profileForm.service_price_currency === currency.code;
                        return (
                          <li key={currency.code}>
                            <button
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleCurrencySelect(currency.code);
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/5 ${
                                isSelected ? "bg-white/5 text-emerald-100" : ""
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              {optionFlag ? (
                                <img
                                  src={optionFlag}
                                  alt=""
                                  aria-hidden="true"
                                  className="h-5 w-5 flex-shrink-0 rounded-[6px]"
                                  loading="lazy"
                                />
                              ) : null}
                              <span>{currency.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
                <p className="text-xs text-slate-400">
                  Usaremos esta moneda para tus servicios y estimaciones de
                  precio.
                </p>
              </label>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0f2333] p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <i className="fa-solid fa-tag text-emerald-400"></i>
                    Rango de precios estimado
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceError("");
                      setProfileForm((prev) => {
                        const enabled = !prev.service_price_enabled;
                        return {
                          ...prev,
                          service_price_enabled: enabled,
                          ...(enabled
                            ? {}
                            : {
                                service_price_min: "",
                                service_price_max: "",
                              }),
                        };
                      });
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      profileForm.service_price_enabled
                        ? "bg-emerald-500"
                        : "bg-slate-500/60"
                    }`}
                    aria-pressed={profileForm.service_price_enabled}
                  >
                    <span className="sr-only">Alternar rango de precios</span>
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                        profileForm.service_price_enabled
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    ></span>
                  </button>
                </div>
                {profileForm.service_price_enabled ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        Precio mínimo
                        <input
                          type="number"
                          min="0"
                          name="service_price_min"
                          value={profileForm.service_price_min}
                          onChange={handleProfileChange}
                          className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                          placeholder="Ej. 100"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        Precio máximo
                        <input
                          type="number"
                          min="0"
                          name="service_price_max"
                          value={profileForm.service_price_max}
                          onChange={handleProfileChange}
                          className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                          placeholder="Ej. 250"
                        />
                      </label>
                    </div>
                    {priceError ? (
                      <p className="text-xs text-red-300">{priceError}</p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Se mostrará en tu encabezado como referencia rápida para
                        los clientes.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400">
                    Actívalo si quieres mostrar un rango estimado en tu perfil.
                  </p>
                )}
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="flex items-center gap-2 font-semibold text-white/90">
                  <i className="fa-solid fa-truck text-emerald-400"></i>
                  Transporte
                </span>
                <input
                  type="text"
                  name="service_transport"
                  value={profileForm.service_transport}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Vehículo propio, transporte público"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="flex items-center gap-2 font-semibold text-white/90">
                  <i className="fa-regular fa-clock text-emerald-400"></i>
                  Respuesta promedio
                </span>
                <input
                  type="text"
                  name="service_response_time"
                  value={profileForm.service_response_time}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Menos de 24 horas"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="flex items-center gap-2 font-semibold text-white/90">
                  <i className="fa-solid fa-bolt text-emerald-400"></i>
                  Emergencias
                </span>
                <input
                  type="text"
                  name="service_emergency"
                  value={profileForm.service_emergency}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Consulta disponibilidad previa"
                />
              </label>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1b28] p-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-black/30">
                {profileForm.profile_picture ? (
                  <img
                    src={profileForm.profile_picture}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-200">
                <p className="font-semibold">Vista previa</p>
                <p className="text-slate-400">
                  Usa un enlace público para tu foto de perfil.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={disableSubmit}
              className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </aside>
        </form>
      </div>
      <MapPickerModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onConfirm={handleMapConfirm}
        initialAddress={profileForm.service_address}
        initialPosition={storedMapPosition || undefined}
      />
    </section>
  );
}
