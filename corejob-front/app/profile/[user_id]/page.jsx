"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PortfolioModal from "@/components/PortfolioModal";

const mockProfile = {
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  name: "Carlos Rodríguez Martín",
  title: "Fontanero Profesional Certificado",
  rating: 4.8,
  reviews: 127,
  completion: 98,
  responseTime: "Responde en 2 horas",
  memberSince: "Miembro desde 2019",
  jobsCompleted: "342 trabajos completados",
  location: "Madrid Centro, España",
  priceRange: "€25-85/hora",
  services: ["Instalaciones", "Reparaciones", "Mantenimiento"],
};

const mockPortfolio = [
  {
    id: 1,
    title: "Renovación completa de baño",
    description:
      "Instalación completa de baño con ducha italiana y grifería moderna. Incluyó impermeabilización y acabados en microcemento.",
    category: "Instalaciones",
    date: "Marzo 2024",
    cover:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: 2,
    title: "Reparación de fuga en cocina",
    description:
      "Reparación de tubería principal en cocina, trabajo realizado en tiempo récord con materiales certificados.",
    category: "Reparaciones",
    date: "Febrero 2024",
    cover:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: 3,
    title: "Instalación de calefacción",
    description:
      "Sistema de calefacción por suelo radiante en vivienda de 120m². Optimizado para eficiencia energética.",
    category: "Calefacción",
    date: "Enero 2024",
    cover:
      "https://images.unsplash.com/photo-1616628182501-d48b1f7c7b61?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616628182501-d48b1f7c7b61?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1520881363902-7f0e1a3e5b37?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: 4,
    title: "Mantenimiento integral edificio",
    description:
      "Proyecto de mantenimiento preventivo y correctivo en complejo residencial de 20 unidades.",
    category: "Mantenimiento",
    date: "Noviembre 2023",
    cover:
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1523419409543-a5e549c1a1f6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: 5,
    title: "Desatasco de red sanitaria",
    description:
      "Servicio de desatasco de tuberías con equipos de alta presión. Informe técnico incluido.",
    category: "Desatascos",
    date: "Octubre 2023",
    cover:
      "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: 6,
    title: "Upgrade de caldera eco",
    description:
      "Sustitución de caldera tradicional por modelo eco eficiente con conectividad inteligente.",
    category: "Calefacción",
    date: "Agosto 2023",
    cover:
      "https://images.unsplash.com/photo-1600585154340-0ef3c08dcdb6?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-0ef3c08dcdb6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1581093588401-16ec9a1990b5?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1523419409543-a5e549c1a1f6?auto=format&fit=crop&w=1400&q=80",
    ],
  },
];

export default function ProfileView() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = useMemo(
    () => ["Todos", ...new Set(mockPortfolio.map((item) => item.category))],
    []
  );

  const filteredPortfolio = useMemo(() => {
    if (activeCategory === "Todos") return mockPortfolio;
    return mockPortfolio.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#09131d,_#04070a)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Link
          href="/search"
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1621] px-4 py-2 text-sm text-emerald-100 transition hover:bg-[#102132]"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Volver a resultados
        </Link>

        <article className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)] md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[#0f2c25]">
              <img
                src={mockProfile.avatar}
                alt={mockProfile.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 right-1 h-4 w-4 rounded-full border-4 border-[#0b1621] bg-emerald-500"></span>
            </div>

            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {mockProfile.name}
                </h1>
                <p className="text-sm text-emerald-100 sm:text-base">
                  {mockProfile.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-emerald-200">
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-shield-check text-emerald-300"></i>
                  Verificado
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-emerald-300"></i>
                  Asegurado
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-certificate text-emerald-300"></i>
                  Certificado
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fa-solid ${
                        index < Math.round(mockProfile.rating)
                          ? "fa-star"
                          : "fa-star-half-stroke"
                      }`}
                    ></i>
                  ))}
                </span>
                <span className="text-base font-medium text-white">
                  {mockProfile.rating}
                </span>
                <span className="text-sm text-slate-400">
                  ({mockProfile.reviews} reseñas)
                </span>
                <span className="inline-flex items-center gap-2 text-emerald-200">
                  <i className="fa-solid fa-circle-check"></i>
                  {mockProfile.completion}% completado
                </span>
                <span className="inline-flex items-center gap-2 text-slate-300">
                  <i className="fa-solid fa-location-dot"></i>
                  {mockProfile.location}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <i className="fa-regular fa-clock"></i>
                  {mockProfile.responseTime}
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fa-regular fa-calendar"></i>
                  {mockProfile.memberSince}
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-briefcase"></i>
                  {mockProfile.jobsCompleted}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200">
                {mockProfile.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-emerald-500/40 px-3 py-1"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-4">
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
              <i className="fa-regular fa-calendar"></i>
              Reservar ahora
            </button>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-white transition hover:bg-white/10">
                <i className="fa-regular fa-message"></i>
                Mensaje
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-white transition hover:bg-white/10">
                <i className="fa-regular fa-user-plus"></i>
                Seguir
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0f2333] px-5 py-4 text-center">
              <p className="text-base font-semibold text-white">
                {mockProfile.priceRange}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Rango de precios
              </p>
            </div>
          </div>
        </article>

        <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Portafolio</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-emerald-700 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]"
                      : "border border-white/10 text-emerald-100 hover:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </header>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPortfolio.map((project) => (
              <article
                key={project.id}
                className="flex cursor-pointer flex-col gap-3 rounded-[24px] border border-white/10 bg-[#101e2a] p-4 text-white transition hover:-translate-y-1 hover:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedProject(project);
                  setOpenModal(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                    setOpenModal(true);
                  }
                }}
              >
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{project.category}</span>
                    <span>{project.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <PortfolioModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          project={selectedProject}
        />
      </div>
    </section>
  );
}
