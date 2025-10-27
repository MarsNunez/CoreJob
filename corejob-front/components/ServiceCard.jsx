import Link from "next/link";

export default function ServiceCard({
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
    <article className="flex gap-5 flex-col xl:flex-row rounded-2xl border border-white/20 bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur text-slate-800 max-w-4xl">
      <div className="overflow-hidden rounded-xl h-full w-full xl:max-w-[18rem] xl:max-h-70 max-h-52">
        <img src={photo} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-400">Design · Maintenance</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
            <i className="fa-solid fa-star text-xs"></i>
            {rating}
          </div>
        </header>

        <div className="flex flex-wrap xl:flex-col gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-user text-slate-400"></i>
            Joined {joined}
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-slate-400"></i>
            {location}
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-clock text-slate-400"></i>
            {schedule}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase text-slate-400">Costo</p>
            <p className="text-3xl font-semibold text-slate-900">
              {price}{" "}
              <span className="text-base text-slate-500">{priceUnit}</span>
            </p>
          </div>
          <Link
            href={"/myservices/manage/102302"}
            className="rounded-2xl bg-[#065f46] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(6,95,70,0.3)] transition hover:translate-y-0.5 hover:bg-[#077254]"
          >
            Gestionar
          </Link>
        </footer>
      </div>
    </article>
  );
}
