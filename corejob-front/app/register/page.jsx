"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchJSON, setAuthSession } from "../../lib/api.js";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "client",
  location_country: "",
  location_city: "",
  password: "",
  confirmPassword: "",
};

const initialProfile = {
  profile_picture: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [profileInfo, setProfileInfo] = useState(initialProfile);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailCheck, setEmailCheck] = useState({
    email: "",
    available: true,
  });
  const router = useRouter();

  const isProvider = form.role === "provider";
  const totalSteps = isProvider ? 3 : 1;
  const isFinal = step === totalSteps - 1;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchJSON("/categories", { suppressRedirect: true });
        setCategories(data || []);
      } catch (err) {
        console.error("No se pudieron cargar las categorías", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isProvider && step > 0) {
      setStep(0);
      setSelectedCategories([]);
      setProfileInfo(initialProfile);
    }
  }, [isProvider, step]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id) => {
    setError("");
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateStep = async (currentStep) => {
    if (currentStep === 0) {
      if (!form.fullName.trim()) {
        setError("Ingresa tu nombre completo");
        return false;
      }
      if (!form.email.trim()) {
        setError("Ingresa un correo electrónico");
        return false;
      }
      if (!emailRegex.test(form.email.trim())) {
        setError("Ingresa un correo válido");
        return false;
      }

      if (
        form.email.trim() !== emailCheck.email ||
        !emailCheck.available
      ) {
        try {
          const result = await fetchJSON("/users/check", {
            method: "GET",
            params: { email: form.email.trim() },
            suppressRedirect: true,
          });
          if (result.exists) {
            setEmailCheck({ email: form.email.trim(), available: false });
            setError("Este correo ya está registrado");
            return false;
          }
          setEmailCheck({ email: form.email.trim(), available: true });
        } catch (err) {
          setError(err.message || "No se pudo validar el correo");
          return false;
        }
      }

      if (form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return false;
      }

      if (form.password !== form.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return false;
      }
    }

    if (currentStep === 1 && isProvider) {
      if (!form.phone.trim()) {
        setError("Ingresa un teléfono de contacto");
        return false;
      }
      if (!form.location_country.trim()) {
        setError("Ingresa tu país");
        return false;
      }
      if (!form.location_city.trim()) {
        setError("Ingresa tu ciudad");
        return false;
      }
    }

    return true;
  };

  const goNext = async () => {
    setError("");
    const valid = await validateStep(step);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };
  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const baseValid = await validateStep(0);
    if (!baseValid) {
      setStep(0);
      return;
    }

    if (isProvider) {
      const contactValid = await validateStep(1);
      if (!contactValid) {
        setStep(1);
        return;
      }
      if (selectedCategories.length === 0) {
        setError("Selecciona al menos una categoría");
        setStep(2);
        return;
      }
    }

    setLoading(true);
    try {
      const userPayload = {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        location_country: form.location_country,
        location_city: form.location_city,
        password: form.password,
      };
      const data = await fetchJSON("/users", {
        method: "POST",
        data: userPayload,
        suppressRedirect: true,
      });

      if (isProvider && data?.user?._id) {
        await fetchJSON("/profiles", {
          method: "POST",
          data: {
            user_id: data.user._id,
            profile_picture: profileInfo.profile_picture,
            categories: selectedCategories,
          },
          suppressRedirect: true,
        });
      }

      setAuthSession(data.token, data.user);
      router.push("/");
    } catch (err) {
      setError(err.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  const sliderStyle = {
    transform: `translateX(-${step * 100}%)`,
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
              Conecta con clientes, comparte tus servicios y haz crecer tu negocio.
            </h2>
            <p className="text-sm text-white/70">
              Regístrate gratis para empezar a recibir solicitudes y construir tu
              portafolio profesional.
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
              {isProvider ? `Paso ${step + 1} de ${totalSteps}` : "Comienza aquí"}
            </p>
            <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
            <p className="text-sm text-slate-300">
              Completa los campos y estarás listo en segundos.
            </p>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={sliderStyle}
              >
                <div className="min-w-full flex-shrink-0 space-y-5 pr-0 md:pr-6">
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
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                    ¿Cómo usarás CoreJob?
                    <select
                      name="role"
                      className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                      value={form.role}
                      onChange={(event) => {
                        handleChange(event);
                        setError("");
                        setStep(0);
                      }}
                    >
                      <option value="client">Contratar servicios</option>
                      <option value="provider">Ofrecer mis servicios</option>
                    </select>
                  </label>
                </div>

                {isProvider && (
                  <div className="min-w-full flex-shrink-0 space-y-5 px-0 md:px-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                        Teléfono
                        <input
                          name="phone"
                          type="tel"
                          className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                        País
                        <input
                          name="location_country"
                          type="text"
                          className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                          value={form.location_country}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                      Ciudad
                      <input
                        name="location_city"
                        type="text"
                        className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                        value={form.location_city}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                )}

                {isProvider && (
                  <div className="min-w-full flex-shrink-0 space-y-5 pl-0 md:pl-6">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
                      URL de foto de perfil
                      <input
                        name="profile_picture"
                        type="text"
                        className="rounded-2xl border border-white/10 bg-[#061120] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                        value={profileInfo.profile_picture}
                        onChange={handleProfileChange}
                      />
                    </label>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-200">
                        Categorías de servicio
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const active = selectedCategories.includes(category._id);
                          return (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => toggleCategory(category._id)}
                              className={`rounded-full border px-4 py-1 text-sm transition ${
                                active
                                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                                  : "border-white/10 text-slate-200 hover:bg-white/5"
                              }`}
                            >
                              {category.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className={`rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10 ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                Anterior
              </button>

              {isProvider && !isFinal ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-2xl border border-emerald-500/40 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(6,182,212,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              )}
            </div>
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
