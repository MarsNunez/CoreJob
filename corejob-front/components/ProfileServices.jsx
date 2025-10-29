"use client";

import Card from "@/components/Card";

const mockServices = [
  {
    id: 1,
    title: "Reparación de Fugas",
    description:
      "Detección y reparación de fugas en tuberías, grifos y sistemas de fontanería. Servicio de emergencia disponible 24/7.",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    badgeLeft: "Fontanería",
    badgeRight: "Disponible",
    price: { label: "€35", suffix: "/hora" },
    duration: "1-3 horas",
    availability: "Disponible",
    tags: ["Emergencia 24/7", "Detección con cámara", "Garantía 2 años"],
    rating: 4,
    reviews: 45,
    includes: [
      "Diagnóstico completo del problema",
      "Reparación con materiales de calidad",
      "Limpieza del área de trabajo",
      "Garantía de 2 años en reparaciones",
    ],
    requirements: [
      "Acceso libre a la zona afectada",
      "Corte de agua si es necesario",
      "Espacio para herramientas y materiales",
    ],
  },
  {
    id: 2,
    title: "Instalación de Baños",
    description:
      "Instalación completa de baños incluyendo sanitarios, grifería, azulejos y sistemas de ventilación.",
    image:
      "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1200&q=80",
    badgeLeft: "Renovaciones",
    badgeRight: "Premium",
    price: { label: "€850", suffix: "/proyecto" },
    duration: "3-5 días",
    availability: "Disponible",
    tags: ["Diseño personalizado", "Materiales incluidos", "Garantía 5 años"],
    rating: 4,
    reviews: 23,
    includes: [
      "Planificación y diseño 3D",
      "Instalación de sanitarios y grifería",
      "Colocación de azulejos y acabados",
      "Pruebas y certificación final",
    ],
    requirements: [
      "Planos o ideas de diseño deseado",
      "Definición de materiales preferidos",
      "Acceso a toma de agua y desagües",
    ],
  },
];

export default function ProfileServices() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <h2 className="text-2xl font-semibold text-white">Servicios Ofrecidos</h2>

      <div className="mt-6 space-y-6">
        {mockServices.map((service) => {
          const fullStars = Math.floor(service.rating);
          const hasHalfStar = service.rating % 1 >= 0.5;
          const stars = [...Array(5)].map((_, index) => {
            let iconClass = "fa-regular fa-star text-slate-600";

            if (index < fullStars) {
              iconClass = "fa-solid fa-star text-amber-400";
            } else if (index === fullStars && hasHalfStar) {
              iconClass = "fa-solid fa-star-half-stroke text-amber-400";
            }

            return <i key={index} className={iconClass}></i>;
          });

          return (
            <Card
              key={service.id}
              layout="horizontal"
              imageSrc={service.image}
              badgeLeft={service.badgeLeft}
              badgeRight={service.badgeRight}
              title={service.title}
            >
              <div className="flex flex-col gap-6">
                <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-amber-400">
                        {stars}
                      </div>
                      <span className="text-sm text-slate-200">
                        {service.rating.toFixed(1)} ({service.reviews})
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 text-sm">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600">
                      <i className="fa-regular fa-calendar"></i>
                      Reservar
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-white transition hover:bg-white/10">
                      Más detalles
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </button>
                  </div>
                </header>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
                  <span className="text-lg font-semibold text-emerald-300">
                    {service.price.label}
                    <span className="text-sm font-normal text-slate-300">
                      {service.price.suffix}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-slate-300">
                    <i className="fa-regular fa-clock"></i>
                    {service.duration}
                  </span>
                  <span className="flex items-center gap-2 text-emerald-300">
                    <i className="fa-solid fa-circle-check"></i>
                    {service.availability}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid gap-6 border-t border-white/10 pt-6 text-sm text-slate-200 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      ¿Qué incluye?
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <i className="fa-solid fa-check text-emerald-400 mt-1"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Requisitos
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {service.requirements.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <i className="fa-solid fa-circle-info text-emerald-400 mt-1"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
}
