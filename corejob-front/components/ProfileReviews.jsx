"use client";

import { useMemo, useState } from "react";

const mockReviews = [
  {
    id: 1,
    author: "María González",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=120&h=120&q=80",
    rating: 5,
    date: "14 de marzo de 2024",
    service: "Reparación de Fugas",
    comment:
      "Excelente servicio. Carlos llegó puntual y solucionó la fuga en mi cocina muy rápidamente. Muy profesional y limpio en su trabajo. Lo recomiendo sin dudas.",
    images: [
      "https://images.unsplash.com/photo-1560185008-5f0bb1866cab?auto=format&fit=crop&w=600&q=80",
    ],
    reply: {
      author: "Respuesta del proveedor",
      date: "15 de marzo de 2024",
      message:
        "Muchas gracias María por tu confianza. Me alegra haber podido resolver el problema rápidamente. No dudes en contactarme para cualquier necesidad futura.",
    },
    likes: 12,
    reports: 0,
  },
  {
    id: 2,
    author: "Javier Martín",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=120&h=120&q=80",
    rating: 4,
    date: "9 de marzo de 2024",
    service: "Instalación de Baños",
    comment:
      "Estamos muy contentos con la instalación completa del baño. Buen asesoramiento y acabados de calidad. Hubo un pequeño retraso con un material pero lo gestionaron bien.",
    images: [],
    reply: null,
    likes: 9,
    reports: 1,
  },
  {
    id: 3,
    author: "Laura Pérez",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=120&h=120&q=80",
    rating: 5,
    date: "22 de febrero de 2024",
    service: "Mantenimiento general",
    comment:
      "Contratamos mantenimiento preventivo para nuestra comunidad. Puntualidad, buena comunicación y dejaron todo impecable.",
    images: [],
    reply: {
      author: "Respuesta del proveedor",
      date: "23 de febrero de 2024",
      message:
        "¡Gracias Laura! Ha sido un placer trabajar con vuestra comunidad. Seguimos a vuestra disposición.",
    },
    likes: 15,
    reports: 0,
  },
];

const ratingSummary = {
  average: 4.8,
  totalReviews: mockReviews.length,
  distribution: [
    { rating: 5, count: 89 },
    { rating: 4, count: 28 },
    { rating: 3, count: 7 },
    { rating: 2, count: 2 },
    { rating: 1, count: 1 },
  ],
};

const ratingFilters = ["Todas", "5 estrellas", "4 estrellas", "3 estrellas", "2 estrellas", "1 estrella"];

export default function ProfileReviews() {
  const [filter, setFilter] = useState("Todas");

  const filteredReviews = useMemo(() => {
    if (filter === "Todas") return mockReviews;
    const selected = parseInt(filter, 10);
    return mockReviews.filter((review) => review.rating === selected);
  }, [filter]);

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            Reseñas y Calificaciones
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-semibold text-white">
              {ratingSummary.average.toFixed(1)}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, index) => {
                  const hasHalfStar = ratingSummary.average % 1 >= 0.5;
                  const fullStars = Math.floor(ratingSummary.average);
                  let iconClass = "fa-regular fa-star text-slate-600";

                  if (index < fullStars) {
                    iconClass = "fa-solid fa-star text-amber-400";
                  } else if (index === fullStars && hasHalfStar) {
                    iconClass = "fa-solid fa-star-half-stroke text-amber-400";
                  }

                  return <i key={index} className={iconClass}></i>;
                })}
              </div>
              <p className="text-sm text-slate-300">
                Basado en {ratingSummary.totalReviews} reseñas
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-2">
          {ratingSummary.distribution.map((item) => {
            const widthPercent = Math.min((item.count / 89) * 100, 100);

            return (
              <div key={item.rating} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-10 text-right">
                  {item.rating} <i className="fa-solid fa-star text-amber-400"></i>
                </span>
                <div className="h-2 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${widthPercent}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-slate-400">{item.count}</span>
              </div>
            );
          })}
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        {ratingFilters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              filter === option
                ? "bg-emerald-700 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]"
                : "border border-white/10 text-emerald-100 hover:bg-white/5"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-white/10 bg-[#101e2a] p-6 text-white"
          >
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold">{review.author}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fa-star ${
                            index < review.rating
                              ? "fa-solid text-amber-400"
                              : "fa-regular text-slate-600"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-slate-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-emerald-200">{review.service}</p>
                </div>
              </div>
            </header>

            <p className="mt-4 text-sm text-slate-200">{review.comment}</p>

            {review.images.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {review.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={`Imagen de ${review.service}`}
                    className="h-32 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            ) : null}

            {review.reply ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-[#0f2030] p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-emerald-200">
                  <i className="fa-regular fa-message"></i>
                  <span className="font-semibold">{review.reply.author}</span>
                  <span className="text-xs text-slate-400">{review.reply.date}</span>
                </div>
                <p className="mt-2 text-sm text-slate-200">{review.reply.message}</p>
              </div>
            ) : null}

            <footer className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <button className="inline-flex items-center gap-2 transition hover:text-white">
                <i className="fa-regular fa-thumbs-up"></i>
                Útil ({review.likes})
              </button>
              <button className="inline-flex items-center gap-2 transition hover:text-white">
                <i className="fa-regular fa-flag"></i>
                Reportar
              </button>
            </footer>
          </article>
        ))}

        {!filteredReviews.length ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#101e2a] p-10 text-center text-sm text-slate-300">
            Aún no hay reseñas con este filtro.
          </div>
        ) : null}
      </div>
    </section>
  );
}
