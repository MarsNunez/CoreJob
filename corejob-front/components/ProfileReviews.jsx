"use client";

import { useMemo } from "react";

export default function ProfileReviews({ reviews = [] }) {
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );
    return Number(total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Reseñas</h2>
          <p className="text-sm text-slate-400">
            Lo que dicen los clientes sobre este servicio
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p className="text-3xl font-semibold text-white">
            {average || "0.0"}
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {reviews.length} reseñas
          </p>
        </div>
      </header>

      {reviews.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-white/10 bg-[#101e2a] p-6 text-center text-slate-300">
          Nada que mostrar por ahora.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[24px] border border-white/10 bg-[#101e2a] p-5 text-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-300">{review.date}</p>
                  <p className="text-base font-semibold">{review.userName}</p>
                  <p className="text-sm text-emerald-200">
                    {review.serviceTitle}
                  </p>
                </div>
                <div className="text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fa-solid ${
                        index < Math.round(review.rating || 0)
                          ? "fa-star"
                          : "fa-star-half-stroke"
                      }`}
                    ></i>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-200">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
