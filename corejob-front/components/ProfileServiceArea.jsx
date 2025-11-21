"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const LeafletServiceMap = dynamic(() => import("./ProfileServiceMap.jsx"), {
  ssr: false,
});

export default function ProfileServiceArea({ location = {} }) {
  const {
    addressTitle,
    addressSubtitle,
    serviceRadius,
    serviceRadiusValue,
    serviceRadiusUnit,
    transport,
    responseTime,
    emergency,
    mapEmbedUrl,
    lat,
    lng,
  } = location;

  const radiusMeters = useMemo(() => {
    if (serviceRadiusValue === null || serviceRadiusValue === undefined)
      return null;
    const value = Number(serviceRadiusValue);
    if (Number.isNaN(value)) return null;
    const unit = serviceRadiusUnit === "m" ? "m" : "km";
    return unit === "m" ? value : value * 1000;
  }, [serviceRadiusValue, serviceRadiusUnit]);

  const hasCoords =
    typeof lat === "number" &&
    !Number.isNaN(lat) &&
    typeof lng === "number" &&
    !Number.isNaN(lng);

  const infoRows = [
    {
      icon: "fa-solid fa-location-dot",
      label: "Dirección",
      title: addressTitle || "Ubicación no especificada",
      subtitle:
        addressSubtitle ||
        "Añade tu ciudad y país para que los clientes puedan ubicarte.",
    },
    {
      icon: "fa-solid fa-paper-plane",
      label: "Radio de servicio",
      title: serviceRadius || "Radio no definido",
      subtitle: "Actualiza este dato desde tu panel de servicios.",
    },
    {
      icon: "fa-solid fa-truck",
      label: "Transporte",
      title: transport || "No especificado",
      subtitle: "Cuéntale a tus clientes cómo te desplazas.",
    },
  ];

  const timingRows = [
    {
      icon: "fa-regular fa-clock",
      label: "Respuesta promedio",
      title: responseTime || "Menos de 24 horas",
      subtitle: "Comparte tus tiempos habituales.",
    },
    {
      icon: "fa-solid fa-bolt",
      label: "Emergencias",
      title: emergency || "Consulta disponibilidad previa",
      subtitle: "",
    },
  ];

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
        {hasCoords ? (
          <LeafletServiceMap
            lat={lat}
            lng={lng}
            radiusMeters={radiusMeters}
            addressTitle={addressTitle}
          />
        ) : mapEmbedUrl ? (
          <iframe
            title="Mapa de ubicación del profesional"
            src={mapEmbedUrl}
            className="h-64 w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center bg-gradient-to-br from-[#0c1c2c] to-[#09121f] text-center text-sm text-slate-400">
            <i className="fa-solid fa-map-location-dot mb-3 text-2xl text-emerald-300"></i>
            Añade un mapa o dirección más detallada para que aparezca aquí.
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-white">
            Información de ubicación
          </h3>
          <div className="space-y-3">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <i className={`${row.icon} mt-1 text-emerald-400`}></i>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {row.label}
                  </p>
                  <p className="font-semibold text-white">{row.title}</p>
                  <p className="text-slate-300">{row.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-white">
            Tiempo de respuesta
          </h3>
          <div className="space-y-3">
            {timingRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <i className={`${row.icon} mt-1 text-emerald-400`}></i>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {row.label}
                  </p>
                  <p className="font-semibold text-white">{row.title}</p>
                  {row.subtitle ? (
                    <p className="text-slate-300">{row.subtitle}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
