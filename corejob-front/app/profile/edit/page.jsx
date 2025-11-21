"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchJSON, getCurrentUser, getToken, setAuthSession } from "@/lib/api";

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
    location_country: "",
    location_city: "",
    password: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    profile_picture: "",
    service_map_url: "",
    service_address: "",
    service_radius: "",
    service_transport: "",
    service_response_time: "",
    service_emergency: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);

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
          location_country: currentUser.location_country || "",
          location_city: currentUser.location_city || "",
        }));

        if (matchedProfile) {
          setProfileForm({
            bio: matchedProfile.bio || "",
            profile_picture: matchedProfile.profile_picture || "",
            service_map_url: matchedProfile.service_map_url || "",
            service_address: matchedProfile.service_address || "",
            service_radius: matchedProfile.service_radius || "",
            service_transport: matchedProfile.service_transport || "",
            service_response_time: matchedProfile.service_response_time || "",
            service_emergency: matchedProfile.service_emergency || "",
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

  const computedMapUrl = useMemo(() => {
    if (profileForm.service_map_url.trim()) return profileForm.service_map_url.trim();
    if (profileForm.service_address.trim()) {
      const q = encodeURIComponent(profileForm.service_address.trim());
      return `https://www.google.com/maps?q=${q}&output=embed`;
    }
    return "";
  }, [profileForm.service_map_url, profileForm.service_address]);

  const handleMapConfirm = ({ address, mapUrl }) => {
    setProfileForm((prev) => ({
      ...prev,
      service_address: address || prev.service_address,
      service_map_url: mapUrl || prev.service_map_url,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?._id) return;
    setSaving(true);
    setError("");

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

    const userPayload = {
      full_name: userForm.full_name.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      location_country: userForm.location_country.trim(),
      location_city: userForm.location_city.trim(),
      ...(userForm.password ? { password: userForm.password } : {}),
    };

    const profilePayload = {
      user_id: currentUser._id,
      bio: profileForm.bio.trim(),
      profile_picture: profileForm.profile_picture.trim(),
      categories: selectedCategories,
      service_map_url: computedMapUrl,
      service_address: profileForm.service_address.trim(),
      service_radius: profileForm.service_radius.trim(),
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
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                País
                <input
                  type="text"
                  name="location_country"
                  value={userForm.location_country}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Ciudad
                <input
                  type="text"
                  name="location_city"
                  value={userForm.location_city}
                  onChange={handleUserChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                />
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
                Dirección
                <input
                  type="text"
                  name="service_address"
                  value={profileForm.service_address}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Calle, ciudad, país"
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
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Radio de servicio
                <input
                  type="text"
                  name="service_radius"
                  value={profileForm.service_radius}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Hasta 25 km"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Transporte
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
                Respuesta promedio
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
                Emergencias
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
      />
    </section>
  );
}
