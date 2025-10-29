"use client";

import Card from "@/components/Card";

const services = [
  {
    id: 1,
    title: "Reparación de fugas",
    category: "Fontanería",
    distance: "A domicilio",
    imageSrc:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    provider: {
      name: "Ana Martín",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
      rating: 4.8,
      reviews: 45,
    },
    price: "€35/hora",
    duration: "1–3 horas",
    availability: "Disponible 24/7",
  },
  {
    id: 2,
    title: "Instalación de baños",
    category: "Renovaciones",
    distance: "Proyecto",
    imageSrc:
      "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1200&q=80",
    provider: {
      name: "Ana Martín",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
      rating: 4.7,
      reviews: 23,
    },
    price: "€850/proyecto",
    duration: "3–5 días",
    availability: "Disponible",
  },
  {
    id: 3,
    title: "Mantenimiento de calderas",
    category: "Calefacción",
    distance: "En tu zona",
    imageSrc:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    provider: {
      name: "Ana Martín",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
      rating: 4.9,
      reviews: 61,
    },
    price: "€60/visita",
    duration: "1–2 horas",
    availability: "Esta semana",
  },
  {
    id: 4,
    title: "Desatascos de tuberías",
    category: "Urgencias",
    distance: "A domicilio",
    imageSrc:
      "https://images.unsplash.com/photo-1591454454684-4d02fe31f1af?auto=format&fit=crop&w=1200&q=80",
    provider: {
      name: "Ana Martín",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
      rating: 4.6,
      reviews: 18,
    },
    price: "€90/servicio",
    duration: "< 2 horas",
    availability: "Hoy",
  },
];

export default function ProfileServices() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Servicios</h2>
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
    </section>
  );
}

