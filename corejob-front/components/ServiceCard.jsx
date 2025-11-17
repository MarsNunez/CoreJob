import Link from "next/link";

export default function ServiceCard({
  id = "demo-id",
  title = "House Painting",
  variant = "Eco",
  rating = 4.6,
  joined = "Apr 21, 2024",
  location = "London",
  schedule = "Sun–Fri · 9:30 AM – 11 PM",
  price = "7",
  priceUnit = "$/H",
  photo = "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
}) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_#101c28,_#070d14)] p-4 text-slate-100 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-emerald-400/40 md:p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-black/20 md:h-16 md:w-16">
            <img src={photo} alt={title} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              {variant || "Servicio"}
            </p>
            <h3 className="text-xl font-semibold text-white md:text-2xl">
              {title}
            </h3>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-amber-300 md:px-4 md:py-2 md:text-sm">
          <i className="fa-solid fa-star text-[10px]"></i>
          {rating ? `${rating} / 5` : "Sin reseñas"}
        </div>
      </header>

      <dl className="mt-5 grid gap-3 text-xs text-slate-300 md:grid-cols-3 md:text-sm">
        <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 md:px-4 md:py-3">
          <i className="fa-regular fa-user text-emerald-300"></i>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Creado
            </dt>
            <dd className="font-semibold">{joined}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 md:px-4 md:py-3">
          <i className="fa-solid fa-location-dot text-emerald-300"></i>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Ubicación
            </dt>
            <dd className="font-semibold">{location}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 md:px-4 md:py-3">
          <i className="fa-regular fa-clock text-emerald-300"></i>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Duración
            </dt>
            <dd className="font-semibold">{schedule}</dd>
          </div>
        </div>
      </dl>

      <footer className="mt-5 flex flex-col gap-3 border-t border-white/5 pt-4 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Tarifa
          </p>
          <p className="text-2xl font-semibold text-white md:text-3xl">
            {price}{" "}
            <span className="text-base font-medium text-slate-400">
              {priceUnit}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link
            href={`/myservices/manage/${id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:rounded-2xl md:px-4 md:text-sm"
          >
            <i className="fa-solid fa-pen-to-square text-[10px]"></i>
            Editar
          </Link>
            <Link
            href={`/myservices/manage/${id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500 md:rounded-2xl md:px-4 md:text-sm"
          >
            <i className="fa-solid fa-sliders text-[10px]"></i>
            Gestionar
          </Link>
        </div>
      </footer>
    </article>
  );
}
