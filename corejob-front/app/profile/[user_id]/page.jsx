"use client";

import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import ProfilePortfolio from "@/components/ProfilePortfolio";
import ProfileServices from "@/components/ProfileServices";
import ProfileReviews from "@/components/ProfileReviews";
import ProfileServiceArea from "@/components/ProfileServiceArea";
import ProfileAbout from "@/components/ProfileAbout";
import ProfileQuickBooking from "@/components/ProfileQuickBooking";

const mockProfile = {
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  name: "Carlos Rodríguez Martín",
  title: "Fontanero Profesional Certificado",
  rating: 4.8,
  reviews: 127,
  completion: 98,
  responseTime: "Responde en 2 horas",
  memberSince: "Miembro desde 2019",
  jobsCompleted: "343 trabajos completados",
  location: "Madrid Centro, España",
  priceRange: "€25-85/hora",
  services: ["Instalaciones", "Reparaciones", "Mantenimiento"],
};

export default function ProfileView() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#09131d,#04070a)] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Link
          href="/search"
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1621] px-4 py-2 text-sm text-emerald-100 transition hover:bg-[#102132]"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Volver a resultados
        </Link>

        <ProfileHeader profile={mockProfile} />

        <ProfilePortfolio />
        <ProfileServices />

        <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start lg:gap-8 xl:gap-12">
          <div className="space-y-8">
            <ProfileReviews />
            <ProfileAbout />
            <ProfileServiceArea />
          </div>
          <div className="hidden lg:block lg:sticky lg:top-8 lg:max-w-sm">
            <ProfileQuickBooking />
          </div>
        </div>

        <div className="lg:hidden">
          <ProfileQuickBooking />
        </div>
      </div>
    </section>
  );
}
