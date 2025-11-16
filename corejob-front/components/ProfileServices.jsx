"use client";

import Card from "@/components/Card";

export default function ProfileServices({ services = [] }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Servicios</h2>
      {services.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#101e2a] p-6 text-center text-slate-300">
          Nada que mostrar por ahora.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Card
              key={s.id}
              layout="horizontal"
              imageSrc={s.imageSrc}
              badgeLeft={s.category}
              badgeRight={s.distance}
              title={s.title}
              provider={s.provider}
              priceLabel="Precio desde:"
              priceValue={s.price}
              durationLabel="Duración:"
              durationValue={s.duration}
              availabilityLabel="Disponibilidad:"
              availabilityValue={s.availability}
            />
          ))}
        </div>
      )}
    </section>
  );
}
