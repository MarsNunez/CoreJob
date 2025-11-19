"use client";

import { useMemo, useState } from "react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop";
const DEFAULT_PROVIDER = {
  name: "Ana Martín",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
  rating: 5,
  reviews: 45,
};

export default function Card({
  layout = "vertical",
  imageSrc = DEFAULT_IMAGE,
  badgeLeft = "Clases",
  badgeRight = "2.1 km",
  title = "Clases de guitarra personalizadas",
  provider = DEFAULT_PROVIDER,
  priceLabel = "Precio desde:",
  priceValue = "€20/hora",
  durationLabel = "Duración:",
  durationValue = "1 hora",
  gallery = [],
  children,
}) {
  const [openInfo, setOpenInfo] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const galleryImages = useMemo(() => {
    if (Array.isArray(gallery)) {
      const filtered = gallery.map((url) => url?.trim()).filter(Boolean);
      if (filtered.length) return filtered;
    }
    return imageSrc ? [imageSrc] : [DEFAULT_IMAGE];
  }, [gallery, imageSrc]);

  const openModal = () => {
    setSlideIndex(0);
    setOpenInfo(true);
  };

  const goPrev = () =>
    setSlideIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const goNext = () =>
    setSlideIndex((prev) => (prev + 1) % galleryImages.length);

  const isHorizontal = layout === "horizontal";
  const containerClasses = isHorizontal
    ? "flex w-full flex-col md:flex-row max-w-full"
    : "flex flex-col max-w-[18rem]";

  const mediaClasses = isHorizontal
    ? "relative h-48 w-full cursor-pointer md:h-auto md:w-64 md:flex-shrink-0"
    : "relative h-44 w-full cursor-pointer";

  const contentWrapperClasses = isHorizontal
    ? "flex-1 space-y-4 px-6 py-6"
    : "space-y-4 px-6 py-6";

  return (
    <>
    <article
      className={`${containerClasses} overflow-hidden rounded-xl bg-[#111c27] text-white shadow-[0_20px_45px_rgba(0,0,0,0.4)]`}
    >
      <div className={mediaClasses} onClick={openModal}>
        <img
          src={galleryImages[0] || imageSrc}
          alt={title}
          className="h-full w-full object-cover"
        />
        {badgeLeft ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#055941] px-4 py-1 text-xs font-semibold">
            {badgeLeft}
          </span>
        ) : null}
        {badgeRight ? (
          <span className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-[#1c1c1c]">
            {badgeRight}
          </span>
        ) : null}
      </div>

      <div className={contentWrapperClasses}>
        {children ?? (
          <>
            <h3 className="text-lg font-semibold leading-tight text-left">
              {title}
            </h3>

            <div className="flex items-center gap-4 text-sm">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-x-1">
                  <p className="text-sm font-semibold">{provider.name}</p>
                  <i className="fa-solid fa-circle-check text-green-600"></i>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-semibold text-white">
                    {provider.rating}
                  </span>
                  <span>({provider.reviews})</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">{priceLabel}</span>
                <span className="font-semibold">{priceValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{durationLabel}</span>
                <span className="font-semibold">{durationValue}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <button onClick={openModal} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-white transition hover:bg-white/10">
                <i className="fa-regular fa-circle-question"></i>
                Info
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d7a55] px-4 py-2 font-semibold text-white transition hover:bg-[#096043]">
                <i className="fa-regular fa-calendar"></i>
                Reservar
              </button>
            </div>
          </>
        )}
      </div>
    </article>

    {openInfo && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={() => setOpenInfo(false)}
      >
        <div
          className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1621] shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            onClick={() => setOpenInfo(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="relative aspect-[16/10] w-full bg-black/30">
            {galleryImages.map((src, index) => (
              <img
                key={src + index}
                src={src}
                alt={`${title} ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  slideIndex === index ? "opacity-100" : "opacity-0"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  aria-label="Imagen anterior"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow hover:bg-black/60"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  onClick={goNext}
                  aria-label="Imagen siguiente"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow hover:bg-black/60"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
                <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {galleryImages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        slideIndex === i ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <div className="flex items-center gap-2 text-xs">
                {badgeLeft && (
                  <span className="rounded-full bg-[#055941] px-3 py-1 text-white">{badgeLeft}</span>
                )}
                {badgeRight && (
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[#1c1c1c]">{badgeRight}</span>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
              <img src={provider.avatar} alt={provider.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white">{provider.name}</span>
                  <i className="fa-solid fa-circle-check text-green-600"></i>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-semibold text-white">{provider.rating}</span>
                  <span>({provider.reviews})</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-200 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-slate-400">{priceLabel}</span>
                <span className="font-semibold">{priceValue}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-slate-400">{durationLabel}</span>
                <span className="font-semibold">{durationValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
