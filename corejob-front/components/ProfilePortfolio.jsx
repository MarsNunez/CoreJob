"use client";

import { useMemo, useState } from "react";
import PortfolioModal from "@/components/PortfolioModal";

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

export default function ProfilePortfolio() {
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

      <PortfolioModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        project={selectedProject}
      />
    </section>
  );
}
