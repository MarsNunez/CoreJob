"use client";

import { useState } from "react";

const mockAbout = {
  name: "Carlos",
  summary:
    "Soy Carlos, un fontanero profesional con más de 8 años de experiencia en el sector. Me especializo en reparaciones de emergencia, instalaciones de baños completos y mantenimiento preventivo de sistemas de fontanería.\n\nMi pasión por este trabajo comenzó cuando ayudé a mi padre en su taller siendo adolescente. Desde entonces he vivido proyectos muy variados, desde reparaciones express hasta remodelaciones completas. Me gusta mantener una comunicación clara con mis clientes, trabajar con materiales certificados y entregar soluciones duraderas.",
  specialties: [
    "Reparación de fugas",
    "Instalación de baños",
    "Calefacción",
    "Desatascos",
    "Fontanería de emergencia",
    "Mantenimiento preventivo",
    "Instalaciones nuevas",
    "Sistemas ecológicos",
  ],
};

const MAX_PREVIEW_LENGTH = 260;

export default function ProfileAbout() {
  const [expanded, setExpanded] = useState(false);

  const summaryPreview =
    mockAbout.summary.length > MAX_PREVIEW_LENGTH
      ? `${mockAbout.summary.slice(0, MAX_PREVIEW_LENGTH).trim()}...`
      : mockAbout.summary;

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Acerca de {mockAbout.name}
        </h2>
      </header>

      <div className="mt-4 space-y-4 text-sm text-slate-200">
        {expanded ? (
          mockAbout.summary.split("\n").map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="leading-relaxed">{summaryPreview}</p>
        )}

        {mockAbout.summary.length > MAX_PREVIEW_LENGTH ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            {expanded ? "Ver menos" : "Ver más"}
            <i
              className={`fa-solid fa-chevron-${expanded ? "up" : "down"} text-xs`}
            ></i>
          </button>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Especialidades
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {mockAbout.specialties.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
