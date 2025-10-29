const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop";
const DEFAULT_PROVIDER = {
  name: "Ana Martín",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
  rating: 5,
  reviews: 45,
};

export default function Card({
  layout = "vertical",
  imageSrc = DEFAULT_IMAGE,
  badgeLeft = "Clases",
  badgeRight = "2.1 km",
  title = "Clases de guitarra personalizadas",
  provider = DEFAULT_PROVIDER,
  priceLabel = "Precio desde:",
  priceValue = "€20/hora",
  durationLabel = "Duración:",
  durationValue = "1 hora",
  availabilityLabel = "Disponibilidad:",
  availabilityValue = "Disponible esta semana",
  children,
}) {
  const isHorizontal = layout === "horizontal";
  const containerClasses = isHorizontal
    ? "flex w-full flex-col md:flex-row max-w-full"
    : "flex flex-col max-w-[18rem]";

  const mediaClasses = isHorizontal
    ? "relative h-48 w-full md:h-auto md:w-64 md:flex-shrink-0"
    : "relative h-44 w-full";

  const contentWrapperClasses = isHorizontal
    ? "flex-1 space-y-4 px-6 py-6"
    : "space-y-4 px-6 py-6";

  return (
    <article
      className={`${containerClasses} overflow-hidden rounded-xl bg-[#111c27] text-white shadow-[0_20px_45px_rgba(0,0,0,0.4)]`}
    >
      <div className={mediaClasses}>
        <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
        {badgeLeft ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#055941] px-4 py-1 text-xs font-semibold">
            {badgeLeft}
          </span>
        ) : null}
        {badgeRight ? (
          <span className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-[#1c1c1c]">
            {badgeRight}
          </span>
        ) : null}
      </div>

      <div className={contentWrapperClasses}>
        {children ?? (
          <>
            <h3 className="text-lg font-semibold leading-tight text-left">
              {title}
            </h3>

            <div className="flex items-center gap-4 text-sm">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-x-1">
                  <p className="text-sm font-semibold">{provider.name}</p>
                  <i className="fa-solid fa-circle-check text-green-600"></i>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-semibold text-white">
                    {provider.rating}
                  </span>
                  <span>({provider.reviews})</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">{priceLabel}</span>
                <span className="font-semibold">{priceValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{durationLabel}</span>
                <span className="font-semibold">{durationValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{availabilityLabel}</span>
                <span className="font-semibold text-[#0d7a55]">
                  {availabilityValue}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-white transition hover:bg-white/10">
                <i className="fa-regular fa-comment"></i>
                Contactar
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d7a55] px-4 py-2 font-semibold text-white transition hover:bg-[#096043]">
                <i className="fa-regular fa-calendar"></i>
                Reservar
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
