export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <article className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)] md:flex-row md:items-center md:justify-between md:gap-10">
      <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-center">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[#0f2c25]">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 right-1 h-4 w-4 rounded-full border-4 border-[#0b1621] bg-emerald-500"></span>
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{profile.name}</h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              {profile.title}
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
                    index < Math.round(profile.rating)
                      ? "fa-star"
                      : "fa-star-half-stroke"
                  }`}
                ></i>
              ))}
            </span>
            <span className="text-base font-medium text-white">
              {profile.rating}
            </span>
            <span className="text-sm text-slate-400">
              ({profile.reviews} reseñas)
            </span>
            <span className="inline-flex items-center gap-2 text-emerald-200">
              <i className="fa-solid fa-circle-check"></i>
              {profile.completion}% completado
            </span>
            <span className="inline-flex items-center gap-2 text-slate-300">
              <i className="fa-solid fa-location-dot"></i>
              {profile.location}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <i className="fa-regular fa-clock"></i>
              {profile.responseTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i>
              {profile.memberSince}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-briefcase"></i>
              {profile.jobsCompleted}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200">
            {profile.services.map((service) => (
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
          <p className="text-base font-semibold text-white">{profile.priceRange}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Rango de precios
          </p>
        </div>
      </div>
    </article>
  );
}
