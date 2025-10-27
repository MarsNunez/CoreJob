import ServiceCard from "../../components/ServiceCard.jsx";

const services = [
  {
    id: 1,
    title: "Clases de guitarra personalizadas",
    category: "Clases",
    price: "€20",
    priceType: "hora",
    rating: 4.9,
    reviews: 45,
    tags: ["Todos los niveles", "Online", "Presencial"],
    status: "active",
    location: "Lima · 2.1 km",
    description:
      "Sesiones enfocadas en tus objetivos: desde acordes básicos hasta teoría musical avanzada.",
    updatedAt: "Hace 2 días",
  },
  {
    id: 2,
    title: "Servicio de limpieza profunda",
    category: "Limpieza",
    price: "S/150",
    priceType: "sesión",
    rating: 4.7,
    reviews: 63,
    tags: ["Hogar", "Incluye materiales"],
    status: "paused",
    location: "Miraflores · 5 km",
    description:
      "Ideal para departamentos y oficinas. Incluye desinfección de superficies y aromatización.",
    updatedAt: "Hace 5 días",
  },
  {
    id: 3,
    title: "Soporte técnico remoto",
    category: "Tecnología",
    price: "$35",
    priceType: "proyecto",
    rating: 5,
    reviews: 28,
    tags: ["Online", "Mac/Windows"],
    status: "draft",
    location: "Disponible en todo el país",
    description:
      "Diagnóstico y solución de problemas de software, optimización y copias de seguridad.",
    updatedAt: "Ayer",
  },
];

export default function MyServices() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1b24,#050b10)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-200">
              Mis servicios
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Gestiona tus publicaciones
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Actualiza precios, disponibilidad y revisa el rendimiento.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
            <i className="fa-solid fa-plus text-xs"></i>
            Nuevo servicio
          </button>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 w-fit mx-auto">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
