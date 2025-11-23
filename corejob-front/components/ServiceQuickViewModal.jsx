"use client";

import Card from "./Card";

export default function ServiceQuickViewModal({
  open,
  service,
  provider,
  priceLabel,
  priceValue,
  durationLabel,
  durationValue,
  gallery,
  onClose,
}) {
  if (!open || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#050e17] p-4 shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="mt-6">
          <Card
            layout="horizontal"
            imageSrc={gallery?.[0]}
            badgeRight={service.location || ""}
            title={service.title || "Servicio"}
            provider={provider}
            priceLabel={priceLabel}
            priceValue={priceValue}
            durationLabel={durationLabel}
            durationValue={durationValue}
            gallery={gallery}
          />
        </div>
      </div>
    </div>
  );
}

