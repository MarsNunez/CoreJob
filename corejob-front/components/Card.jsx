export default function Card() {
  return (
    <article className="max-w-[18rem] rounded-xl overflow-hidden bg-[#111c27] text-white shadow-[0_20px_45px_rgba(0,0,0,0.4)]">
      <div className="relative h-44 w-full">
        <img
          src="https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop"
          alt="Clases de guitarra"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#055941] px-4 py-1 text-xs font-semibold">
          Clases
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-[#1c1c1c]">
          2.1 km
        </span>
      </div>

      <div className="space-y-4 px-6 py-6">
        <h3 className="text-lg font-semibold leading-tight text-left">
          Clases de guitarra personalizadas
        </h3>

        <div className="flex items-center gap-4 text-sm">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80"
            alt="Ana Martín"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-x-1">
              <p className="text-sm font-semibold">Ana Martín</p>
              <i className="fa-solid fa-circle-check text-green-600"></i>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <i className="fa-solid fa-star text-yellow-400"></i>
              <span className="font-semibold text-white">5</span>
              <span>(45)</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm text-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-400">Precio desde:</span>
            <span className="font-semibold">€20/hora</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duración:</span>
            <span className="font-semibold">1 hora</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Disponibilidad:</span>
            <span className="font-semibold text-[#0d7a55]">
              Disponible esta semana
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
      </div>
    </article>
  );
}
