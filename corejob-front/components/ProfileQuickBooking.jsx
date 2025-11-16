"use client";

import { useMemo, useState } from "react";

const DEFAULT_SERVICES = [
  { id: "rep-fugas", label: "Reparación de fugas" },
  { id: "inst-banios", label: "Instalación de baños" },
  { id: "calefaccion", label: "Calefacción" },
  { id: "mantenimiento", label: "Mantenimiento preventivo" },
  { id: "emergencias", label: "Servicio de emergencia" },
];

const urgencyOptions = [
  {
    id: "normal",
    label: "Normal (2-7 días)",
    helper: "Ideal para agendar con antelación",
  },
  {
    id: "prioritaria",
    label: "Prioritaria (48h)",
    helper: "Recargo del 15% por disponibilidad inmediata",
  },
  {
    id: "emergencia",
    label: "Emergencia (24h)",
    helper: "Recargo del 35% - atención inmediata",
  },
];

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
];

export default function ProfileQuickBooking({
  serviceOptions = [],
  contactPhone,
  locationLabel,
}) {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [urgencyId, setUrgencyId] = useState("normal");

  const availableServices =
    serviceOptions.length > 0 ? serviceOptions : DEFAULT_SERVICES;
  const safeServiceId = availableServices.some(
    (service) => service.id === serviceId
  )
    ? serviceId
    : "";

  const selectedUrgency = useMemo(
    () => urgencyOptions.find((option) => option.id === urgencyId),
    [urgencyId]
  );
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <aside className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Reserva Rápida</h2>
        <p className="text-sm text-slate-300">
          Agenda tu visita en menos de un minuto. Confirmaremos la
          disponibilidad por correo y WhatsApp.
        </p>
      </header>

      <form className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white"
            htmlFor="quick-service"
          >
            Seleccionar servicio <span className="text-emerald-300">*</span>
          </label>
          <div className="relative">
            <select
              id="quick-service"
              value={safeServiceId}
              onChange={(event) => setServiceId(event.target.value)}
              className={`w-full appearance-none rounded-2xl border border-white/15 bg-[#09131d] px-4 py-3 pr-10 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 ${
                safeServiceId ? "text-white" : "text-slate-400"
              }`}
            >
              <option value="" disabled>
                {availableServices.length
                  ? "Elige un servicio"
                  : "Aún no hay servicios disponibles"}
              </option>
              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
          </div>
          {serviceOptions.length === 0 && (
            <p className="text-xs text-slate-400">
              Crea servicios para mostrarlos en esta lista.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white"
            htmlFor="quick-date"
          >
            Fecha preferida <span className="text-emerald-300">*</span>
          </label>
          <input
            id="quick-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            min={minDate}
            className="w-full rounded-2xl border border-white/15 bg-[#09131d] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white"
            htmlFor="quick-time"
          >
            Hora preferida <span className="text-emerald-300">*</span>
          </label>
          <div className="relative">
            <select
              id="quick-time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={`w-full appearance-none rounded-2xl border border-white/15 bg-[#09131d] px-4 py-3 pr-10 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 ${
                time ? "text-white" : "text-slate-400"
              }`}
            >
              <option value="" disabled>
                Selecciona una hora
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white"
            htmlFor="quick-urgency"
          >
            Urgencia
          </label>
          <div className="relative">
            <select
              id="quick-urgency"
              value={urgencyId}
              onChange={(event) => setUrgencyId(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/15 bg-[#09131d] px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            >
              {urgencyOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
          </div>
          <p className="text-xs text-slate-400">
            {selectedUrgency?.helper ||
              "Elige la urgencia para ajustar la disponibilidad."}
          </p>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
        >
          <i className="fa-regular fa-calendar-check"></i>
          Reservar Ahora
        </button>

        <div className="grid gap-3 md:grid-cols-1">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <i className="fa-regular fa-calendar"></i>
            Consultar Disponibilidad
          </button>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <i className="fa-solid fa-phone"></i>
            Llamar Directamente
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#09131d] px-4 py-3 text-sm text-slate-300">
          <p className="font-semibold text-white">Contacto directo</p>
          <p className="mt-1 text-base text-emerald-200">
            {contactPhone || "Agrega un número para que puedan llamarte"}
          </p>
          {locationLabel ? (
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
              {locationLabel}
            </p>
          ) : null}
        </div>
      </form>
    </aside>
  );
}
