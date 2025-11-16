"use client";

import { useMemo, useState } from "react";

const MAX_PREVIEW_LENGTH = 260;
const DEFAULT_TEXT =
  "El profesional aún no ha compartido información adicional. Mantén tu perfil actualizado para generar confianza.";

export default function ProfileAbout({ name = "", bio, specialties = [] }) {
  const [expanded, setExpanded] = useState(false);

  const summary = useMemo(() => {
    if (typeof bio !== "string" || !bio.trim()) return DEFAULT_TEXT;
    return bio.trim();
  }, [bio]);

  const summaryPreview =
    summary.length > MAX_PREVIEW_LENGTH
      ? `${summary.slice(0, MAX_PREVIEW_LENGTH).trim()}...`
      : summary;

  const canExpand = summary !== DEFAULT_TEXT && summary.length > MAX_PREVIEW_LENGTH;

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Acerca de {name || "este profesional"}
        </h2>
      </header>

      <div className="mt-4 space-y-4 text-sm text-slate-200">
        {expanded ? (
          summary.split("\n").map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="leading-relaxed">{summaryPreview}</p>
        )}

        {canExpand ? (
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
        {specialties.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Agrega categorías o habilidades para mostrar tu experiencia.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {specialties.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
