import Card from "../components/Card.jsx";

const stats = [
  { value: "15,000+", label: "Profesionales" },
  { value: "50+", label: "Categorías" },
  { value: "4.8★", label: "Valoración" },
  { value: "24/7", label: "Disponible" },
];

const categories = [
  {
    title: "Limpieza",
    description: "Limpieza del hogar y oficina",
    services: "1,250 servicios",
    icon: "fa-hands",
    bg: "bg-[#eaf0ff]",
    text: "text-[#1b4fd2]",
    border: "border-[#1b4fd2]",
  },
  {
    title: "Manitas",
    description: "Reparaciones y mantenimiento",
    services: "890 servicios",
    icon: "fa-screwdriver-wrench",
    bg: "bg-[#fff0e1]",
    text: "text-[#d45800]",
    border: "border-[#d45800]",
  },
  {
    title: "Delivery",
    description: "Envíos y mudanzas",
    services: "650 servicios",
    icon: "fa-truck-fast",
    bg: "bg-[#e7f8ec]",
    text: "text-[#138845]",
    border: "border-[#138845]",
  },
  {
    title: "Clases",
    description: "Tutorías y formación",
    services: "420 servicios",
    icon: "fa-graduation-cap",
    bg: "bg-[#f5e9ff]",
    text: "text-[#7a32c6]",
    border: "border-[#7a32c6]",
  },
  {
    title: "Jardinería",
    description: "Cuidado de jardines",
    services: "380 servicios",
    icon: "fa-leaf",
    bg: "bg-[#e6f6ef]",
    text: "text-[#1a7d5e]",
    border: "border-[#1a7d5e]",
  },
  {
    title: "Belleza",
    description: "Peluquería y estética",
    services: "320 servicios",
    icon: "fa-scissors",
    bg: "bg-[#feeff7]",
    text: "text-[#d12b7f]",
    border: "border-[#d12b7f]",
  },
  {
    title: "Tecnología",
    description: "Soporte técnico",
    services: "280 servicios",
    icon: "fa-laptop",
    bg: "bg-[#ecf0ff]",
    text: "text-[#3535c8]",
    border: "border-[#3535c8]",
  },
  {
    title: "Mascotas",
    description: "Cuidado de mascotas",
    services: "190 servicios",
    icon: "fa-heart",
    bg: "bg-[#fde8ea]",
    text: "text-[#d12f32]",
    border: "border-[#d12f32]",
  },
];

export default function Home() {
  return (
    <section className="text-white">
      {/* 01 HERO */}
      <div className="flex w-full flex-col items-center gap-6 bg-[radial-gradient(circle_at_top_right,#0f5f4c,#0b3b30)] px-4 py-16 text-center sm:px-8 lg:px-14">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">
          Conectamos servicios de calidad en todo Perú
        </p>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
          Bienvenido a CoreJob
        </h1>
        <p className="max-w-3xl text-sm text-emerald-50 sm:text-base lg:text-lg">
          Encuentra profesionales locales confiables o comparte tus servicios
          con miles de peruanos que los necesitan.
        </p>

        <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-4 text-black shadow-[0_15px_45px_rgba(0,0,0,0.2)] sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <select
              name="service"
              id="service"
              className="col-span-1 rounded-lg border border-slate-200 px-5 py-3 text-base md:col-span-5"
            >
              <option value="0">¿Qué servicio necesitas?</option>
              <option value="1">Opcion 1</option>
              <option value="2">Opcion 2</option>
              <option value="3">Opcion 3</option>
              <option value="4">Opcion 4</option>
            </select>
            <select
              name="location"
              id="location"
              className="col-span-1 rounded-lg border border-slate-200 px-5 py-3 text-base md:col-span-4"
            >
              <option value="0">¿Donde buscar?</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button className="col-span-1 flex items-center justify-center gap-2 rounded-lg bg-[#065f46] px-5 py-3 text-white transition hover:bg-[#064a39] md:col-span-3">
              <i className="fa-solid fa-magnifying-glass mr-1"></i>
              Buscar
            </button>
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-6 border-t border-white/20 pt-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-sm text-emerald-100">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 02 EXPLORE */}
      <section className="bg-black px-4 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Explora nuestras categorías
          </h2>
          <p className="text-sm text-neutral-300 sm:text-base">
            Encuentra profesionales especializados en cada área
          </p>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                className={`${category.bg} border-2 ${category.border} text-center rounded-xl px-6 py-8 shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-1`}
              >
                <div className="mb-6 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
                  <i
                    className={`fa-solid ${category.icon} ${category.text} text-lg`}
                  ></i>
                </div>
                <h3 className={`text-xl font-semibold ${category.text}`}>
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {category.description}
                </p>
                <p className="mt-4 text-xs font-semibold text-neutral-500">
                  {category.services}
                </p>
              </article>
            ))}
          </div>

          <button className="mx-auto mt-4 inline-flex items-center gap-2 text-emerald-300 transition hover:text-emerald-200">
            Ver todas las categorías
            <i className="fa-solid fa-arrow-right-long text-sm"></i>
          </button>
        </div>
      </section>

      {/* 03 Service cards */}
      <section className="bg-black px-4 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Servicios para ti</h2>
          <p className="text-sm text-neutral-300 sm:text-base">
            Descubre profesionales altamente valorados
          </p>

          {/* Card here */}
          <div className="mx-auto">
            <Card />
          </div>

          <button className="mx-auto mt-4 inline-flex items-center gap-2 text-emerald-300 transition hover:text-emerald-200">
            Ver todas las categorías
            <i className="fa-solid fa-arrow-right-long text-sm"></i>
          </button>
        </div>
      </section>
    </section>
  );
}
