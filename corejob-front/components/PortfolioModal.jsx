"use client";

import { useEffect, useMemo, useState } from "react";

export default function PortfolioModal({ open, onClose, project }) {
  const images = useMemo(() => {
    if (!project) return [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    // Fallback to cover if no images array
    return project.cover ? [project.cover] : [];
  }, [project]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
  }, [open, project]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(images.length, 1));
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  if (!open || !project) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1621] shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Image + Carousel Controls */}
        <div className="relative aspect-[16/10] w-full bg-black/30">
          {images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${project.title} ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                index === i ? "opacity-100" : "opacity-0"
              }`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow hover:bg-black/60"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow hover:bg-black/60"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>

              <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${index === i ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="border-t border-white/10 bg-[#0b1621] p-5">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-300">{project.description}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 text-emerald-300">
              <i className="fa-solid fa-layer-group"></i>
              {project.category}
            </span>
            <span className="inline-flex items-center gap-2 text-slate-300">
              <i className="fa-regular fa-calendar"></i>
              {project.date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
