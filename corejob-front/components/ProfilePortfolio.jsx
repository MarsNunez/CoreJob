"use client";

import { useMemo, useState } from "react";
import PortfolioModal from "@/components/PortfolioModal";

export default function ProfilePortfolio({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = useMemo(() => {
    const unique = new Set(
      projects
        .filter((project) => Boolean(project.category))
        .map((project) => project.category)
    );
    return ["Todos", ...unique];
  }, [projects]);

  const currentCategory = categories.includes(activeCategory)
    ? activeCategory
    : "Todos";

  const filteredPortfolio = useMemo(() => {
    if (currentCategory === "Todos") return projects;
    return projects.filter((item) => item.category === currentCategory);
  }, [projects, currentCategory]);

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Portafolio</h2>
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                currentCategory === category
                  ? "bg-emerald-700 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]"
                  : "border border-white/10 text-emerald-100 hover:bg-white/5"
              }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </header>

      {projects.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-white/10 bg-[#101e2a] p-6 text-center text-slate-300">
          Nada que mostrar por ahora.
        </p>
      ) : (
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
      )}

      <PortfolioModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        project={selectedProject}
      />
    </section>
  );
}
