const stats = [
  { value: "15,000+", label: "Profesionales" },
  { value: "50+", label: "Categorías" },
  { value: "4.8★", label: "Valoración" },
  { value: "24/7", label: "Disponible" },
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
    </section>
  );
}
