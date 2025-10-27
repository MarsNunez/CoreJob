"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const defaultService = {
  title: "House Painting (Eco)",
  category: "Reformas",
  price: 7,
  priceUnit: "$/h",
  description:
    "Servicios de pintura ecológica para interiores, utilizando materiales de bajo impacto y técnicas eficientes.",
  schedule: "Sun–Fri · 9:30 AM – 11 PM",
  location: "London",
  tags: ["Eco", "Interior", "Mantenimiento"],
  availability: "Disponible esta semana",
  experienceYears: 5,
  photos: [
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80",
  ],
};

const categories = [
  "Reformas",
  "Limpieza",
  "Clases",
  "Tecnología",
  "Cuidado de mascotas",
  "Jardinería",
];

const priceUnits = ["$/h", "$/sesión", "$/proyecto", "S/ sesión"];

const ManageServiceView = () => {
  const { service_id } = useParams();
  const [service, setService] = useState(defaultService);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "number"
        ? Number(event.target.value)
        : event.target.value;

    setService((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#0b1b24,_#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Editar servicio
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              {service.title}
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              ID: {service_id}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              onClick={() => setShowPreview(true)}
            >
              Vista previa
            </button>
            <button
              type="button"
              className="rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar
            </button>
            <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
              Guardar cambios
            </button>
          </div>
        </header>

        <form className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Título del servicio
                <input
                  type="text"
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.title}
                  onChange={handleChange("title")}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Categoría
                <select
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.category}
                  onChange={handleChange("category")}
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Precio
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                    value={service.price}
                    onChange={handleChange("price")}
                  />
                  <select
                    className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                    value={service.priceUnit}
                    onChange={handleChange("priceUnit")}
                  >
                    {priceUnits.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Ubicación
                <input
                  type="text"
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.location}
                  onChange={handleChange("location")}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Disponibilidad
                <input
                  type="text"
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.availability}
                  onChange={handleChange("availability")}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Horario
                <input
                  type="text"
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.schedule}
                  onChange={handleChange("schedule")}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Descripción
              <textarea
                rows={6}
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={service.description}
                onChange={handleChange("description")}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Etiquetas (separadas por coma)
              <input
                type="text"
                className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                value={service.tags.join(", ")}
                onChange={(event) =>
                  setService((prev) => ({
                    ...prev,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </label>
          </div>

          <aside className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#09131d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                Galería
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {service.photos.map((photo, index) => (
                  <div
                    key={photo + index}
                    className="group relative overflow-hidden rounded-2xl border border-white/10"
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <button className="absolute right-3 top-3 hidden rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white group-hover:block">
                      Cambiar
                    </button>
                  </div>
                ))}
                <button className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-emerald-500/40 bg-[#0d1b28] text-sm text-emerald-200 transition hover:bg-[#0f2333]">
                  + Añadir foto
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Años de experiencia
                <input
                  type="number"
                  min="0"
                  className="rounded-2xl border border-white/10 bg-[#0d1b28] px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  value={service.experienceYears}
                  onChange={handleChange("experienceYears")}
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#0d1b28] p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">
                  Estado actual
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {["Activo", "Pausado", "Borrador"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 rounded-xl bg-[#0f2333] px-3 py-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={
                          service.status
                            ? service.status === status.toLowerCase()
                            : status === "Activo"
                        }
                        onChange={() =>
                          setService((prev) => ({
                            ...prev,
                            status: status.toLowerCase(),
                          }))
                        }
                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1621] text-white shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
              <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                    Vista previa
                  </p>
                  <h2 className="text-2xl font-semibold">{service.title}</h2>
                  <p className="text-sm text-emerald-100">
                    {service.category} · {service.location}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  onClick={() => setShowPreview(false)}
                >
                  Cerrar
                </button>
              </header>

              <div className="grid max-h-[80vh] gap-6 overflow-y-auto px-6 py-6 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                      Descripción
                    </p>
                    <p className="mt-2 text-base text-slate-100">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                        Precio
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">
                        {service.price}{" "}
                        <span className="text-base text-slate-300">
                          {service.priceUnit}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                        Horario
                      </p>
                      <p className="mt-2 text-base text-slate-100">
                        {service.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                      Disponibilidad
                    </p>
                    <p className="mt-2 text-base text-emerald-100">
                      {service.availability}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                      Etiquetas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-100">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-emerald-400/40 px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                    Galería
                  </p>
                  <div className="mt-3 grid gap-3">
                    {service.photos.map((photo, index) => (
                      <img
                        key={photo + index}
                        src={photo}
                        alt={`Vista previa ${index + 1}`}
                        className="h-28 w-full rounded-2xl border border-white/10 object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4 text-sm text-slate-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                    Experiencia
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {service.experienceYears} años
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0f2333] p-4 text-sm text-slate-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                    Estado
                  </p>
                  <p className="mt-2 text-base capitalize text-emerald-200">
                    {service.status || "Activo"}
                  </p>
                </div>
              </aside>
            </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#101c29] p-6 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
            <h3 className="text-xl font-semibold">Eliminar servicio</h3>
            <p className="mt-3 text-sm text-slate-200">
              ¿Estás seguro de que deseas eliminar <span className="font-semibold">{service.title}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Confirmar eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageServiceView;
