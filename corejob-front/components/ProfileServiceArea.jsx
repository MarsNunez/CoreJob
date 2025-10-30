"use client";

const mockLocation = {
  addressTitle: "Calle Gran Vía 45, 3º B",
  addressSubtitle: "Madrid, España",
  serviceRadius: "Hasta 25 km",
  transport: "Furgoneta equipada con herramientas",
  responseTime: "2 horas",
  availability: "Lun-Sáb, emergencias 24/7",
  emergency: "Disponible 24/7",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.5706387256405!2d-3.7085122236824353!3d40.42028575751356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287c097b7481%3A0xcf2c731f17df0ee6!2sGran%20V%C3%ADa%2C%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses",
};

export default function ProfileServiceArea() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1621] p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Ubicación y Área de Servicio
        </h2>
        <p className="text-sm text-slate-300">
          Consulta la zona principal de operaciones y los tiempos estimados de respuesta.
        </p>
      </header>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
        <iframe
          title="Mapa de ubicación del profesional"
          src={mockLocation.mapEmbedUrl}
          className="h-64 w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-white">
            Información de ubicación
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-location-dot mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">{mockLocation.addressTitle}</p>
                <p className="text-slate-300">{mockLocation.addressSubtitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-paper-plane mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">Radio de servicio</p>
                <p className="text-slate-300">{mockLocation.serviceRadius}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-truck mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">Transporte</p>
                <p className="text-slate-300">{mockLocation.transport}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-white">Tiempo de respuesta</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="fa-regular fa-clock mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">Respuesta promedio</p>
                <p className="text-slate-300">{mockLocation.responseTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-regular fa-calendar mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">Disponibilidad</p>
                <p className="text-slate-300">{mockLocation.availability}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-bolt mt-1 text-emerald-400"></i>
              <div>
                <p className="font-semibold text-white">Servicio de emergencia</p>
                <p className="text-slate-300">{mockLocation.emergency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
