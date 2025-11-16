"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import ProfilePortfolio from "@/components/ProfilePortfolio";
import ProfileServices from "@/components/ProfileServices";
import ProfileReviews from "@/components/ProfileReviews";
import ProfileServiceArea from "@/components/ProfileServiceArea";
import ProfileAbout from "@/components/ProfileAbout";
import ProfileQuickBooking from "@/components/ProfileQuickBooking";
import { fetchJSON, getCurrentUser } from "@/lib/api";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=400&q=80";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80";

const formatPrice = (value) => {
  if (typeof value !== "number") return "Tarifa a coordinar";
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `€${value}`;
  }
};

export default function ProfileView() {
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const storedUser = getCurrentUser();
    const targetId = storedUser?._id || params?.user_id;

    if (!targetId) {
      setError("No se encontró un usuario activo para mostrar el perfil.");
      setLoading(false);
      return undefined;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const userResponse = await fetchJSON(`/users/${targetId}`, {
          suppressRedirect: true,
        });
        const [profilesResponse, categoriesResponse] = await Promise.all([
          fetchJSON("/profiles", { suppressRedirect: true }),
          fetchJSON("/categories", { suppressRedirect: true }),
        ]);

        const matchedProfile =
          profilesResponse.find(
            (item) => String(item.user_id) === String(targetId)
          ) || null;

        let filteredServices = [];
        let filteredPortfolio = [];
        let filteredReviews = [];

        if (userResponse.role === "provider") {
          const [servicesResponse, portfolioResponse, reviewsResponse] =
            await Promise.all([
              fetchJSON("/services", { suppressRedirect: true }),
              fetchJSON("/portfolio-items", { suppressRedirect: true }),
              fetchJSON("/reviews", { suppressRedirect: true }),
            ]);

          filteredServices = servicesResponse.filter(
            (service) => String(service.user_id) === String(targetId)
          );

          const profileId = matchedProfile?._id;
          filteredPortfolio = profileId
            ? portfolioResponse.filter(
                (project) => String(project.profile_id) === String(profileId)
              )
            : [];

          const serviceIds = new Set(
            filteredServices.map((service) => String(service._id))
          );
          filteredReviews = reviewsResponse.filter((review) =>
            serviceIds.has(String(review.service_id))
          );
        }

        if (!active) return;
        setUserData(userResponse);
        setProfileData(matchedProfile);
        setCategories(categoriesResponse || []);
        setServices(filteredServices);
        setPortfolio(filteredPortfolio);
        setReviews(filteredReviews);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(err.message || "No se pudo cargar el perfil.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [params?.user_id]);

  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(String(category._id), category));
    return map;
  }, [categories]);

  const profileCategories = useMemo(() => {
    if (!profileData?.categories?.length) return [];
    return profileData.categories
      .map((categoryId) => categoriesMap.get(String(categoryId))?.name)
      .filter(Boolean);
  }, [profileData, categoriesMap]);

  const priceRange = useMemo(() => {
    if (!services.length) return "Tarifa a coordinar";
    const prices = services
      .map((service) => Number(service.price))
      .filter((value) => !Number.isNaN(value));
    if (!prices.length) return "Tarifa a coordinar";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? formatPrice(min)
      : `${formatPrice(min)} - ${formatPrice(max)}`;
  }, [services]);

  const servicesCards = useMemo(() => {
    if (!services.length) return [];
    return services.map((service) => {
      const firstCategoryId = service.categores_id?.[0];
      const categoryName = categoriesMap.get(String(firstCategoryId))?.name;
      return {
        id: service._id,
        imageSrc: service.photos?.[0] || FALLBACK_IMAGE,
        category: categoryName || "Servicio",
        distance: service.price_type,
        title: service.title,
        provider: {
          name: userData?.full_name || "Profesional CoreJob",
          avatar: profileData?.profile_picture || FALLBACK_AVATAR,
          rating: profileData?.rating_average ?? 0,
          reviews: reviews.length,
        },
        price: formatPrice(service.price),
        duration: service.estimated_duration || "A coordinar",
        availability: service.is_active
          ? "Disponible"
          : "Temporalmente no disponible",
      };
    });
  }, [services, categoriesMap, userData, profileData, reviews.length]);

  const portfolioProjects = useMemo(() => {
    if (!portfolio.length) return [];
    return portfolio.map((project) => ({
      id: project._id,
      title: project.title,
      description: project.description || "Sin descripción disponible.",
      category:
        profileCategories[0] ||
        categoriesMap.get(String(project.category_id))?.name ||
        "Proyecto",
      date: project.createdAt
        ? new Date(project.createdAt).toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })
        : "Fecha no disponible",
      cover: project.image_url || project.images?.[0] || FALLBACK_IMAGE,
      images:
        (project.images && project.images.length > 0
          ? project.images
          : project.image_url
          ? [project.image_url]
          : []) || [],
    }));
  }, [portfolio, profileCategories, categoriesMap]);

  const reviewsData = useMemo(() => {
    if (!reviews.length) return [];
    const serviceMap = new Map(
      services.map((service) => [String(service._id), service])
    );
    return reviews.map((review) => {
      const service = serviceMap.get(String(review.service_id));
      return {
        id: review._id,
        rating: review.rating ?? 0,
        comment: review.comment || "El cliente no dejó comentarios.",
        userName: review.is_anonymous ? "Cliente anónimo" : "Cliente verificado",
        serviceTitle: service?.title || "Servicio CoreJob",
        date: review.date
          ? new Date(review.date).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Fecha no disponible",
      };
    });
  }, [reviews, services]);

  const headerData = useMemo(() => {
    if (!userData) return null;
    const location = [userData.location_city, userData.location_country]
      .filter(Boolean)
      .join(", ");
    const memberSince = userData.createdAt
      ? `Miembro desde ${new Date(userData.createdAt).toLocaleDateString(
          "es-ES",
          {
            month: "long",
            year: "numeric",
          }
        )}`
      : "Miembro de CoreJob";

    return {
      avatar: profileData?.profile_picture || FALLBACK_AVATAR,
      name: userData.full_name,
      title: profileCategories.length
        ? `Especialista en ${profileCategories[0]}`
        : "Profesional de CoreJob",
      rating: profileData?.rating_average ?? 0,
      reviews: reviewsData.length,
      completion: Math.min(100, profileData?.jobs_completed ?? 0),
      responseTime:
        profileData?.availability_calendar?.responseTime ||
        profileData?.availability_calendar?.response_time ||
        "Responde en menos de 24 horas",
      memberSince,
      jobsCompleted: `${profileData?.jobs_completed ?? 0} trabajos completados`,
      location: location || "Ubicación no disponible",
      priceRange,
      services:
        profileCategories.length > 0
          ? profileCategories
          : servicesCards.map((service) => service.title),
    };
  }, [
    userData,
    profileData,
    profileCategories,
    reviewsData.length,
    priceRange,
    servicesCards,
  ]);

  const availabilityText = useMemo(() => {
    if (!profileData?.availability_calendar) return null;
    const entries = Object.entries(profileData.availability_calendar).filter(
      ([, value]) => typeof value === "string" && value.trim().length
    );
    if (!entries.length) return null;
    return entries
      .map(([day, hours]) => `${day}: ${hours}`)
      .join(" · ");
  }, [profileData]);

  const serviceAreaData = useMemo(() => {
    const locationText = [userData?.location_city, userData?.location_country]
      .filter(Boolean)
      .join(", ");
    return {
      addressTitle: userData?.location_city || "Ubicación no especificada",
      addressSubtitle:
        userData?.location_country ||
        "Agrega tu país y ciudad para mostrarlo en tu perfil",
      serviceRadius:
        profileData?.availability_calendar?.radius ||
        "Radio de servicio no definido",
      transport:
        profileData?.availability_calendar?.transport ||
        "Transporte no especificado",
      responseTime:
        profileData?.availability_calendar?.responseTime ||
        profileData?.availability_calendar?.response_time ||
        "Menos de 24 horas",
      availability:
        availabilityText ||
        "Comparte tus horarios para que los clientes puedan reservar.",
      emergency:
        profileData?.availability_calendar?.emergency ||
        "Consulta disponibilidad previa",
      mapEmbedUrl: profileData?.availability_calendar?.map_url || null,
      locationText,
    };
  }, [profileData, userData, availabilityText]);

  const quickBookingOptions = useMemo(() => {
    if (!services.length) return [];
    return services.map((service) => ({
      id: service._id,
      label: service.title,
    }));
  }, [services]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#09131d,#04070a)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 text-center">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-emerald-400" />
          <p className="text-sm text-slate-300">Cargando perfil...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#09131d,#04070a)] px-4 py-10 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#0b1621] p-8 text-center">
          <p className="text-base text-red-200">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-emerald-100 transition hover:bg-white/5"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

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

        {headerData && <ProfileHeader profile={headerData} />}

        <ProfilePortfolio projects={portfolioProjects} />
        <ProfileServices services={servicesCards} />

        <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start lg:gap-8 xl:gap-12">
          <div className="space-y-8">
            <ProfileReviews reviews={reviewsData} />
            <ProfileAbout
              name={userData?.full_name}
              bio={profileData?.bio}
              specialties={profileCategories}
            />
            <ProfileServiceArea location={serviceAreaData} />
          </div>
          <div className="hidden lg:block lg:sticky lg:top-8 lg:max-w-sm">
            <ProfileQuickBooking
              serviceOptions={quickBookingOptions}
              contactPhone={userData?.phone}
              locationLabel={
                serviceAreaData.locationText || userData?.location_city || ""
              }
            />
          </div>
        </div>

        <div className="lg:hidden">
          <ProfileQuickBooking
            serviceOptions={quickBookingOptions}
            contactPhone={userData?.phone}
            locationLabel={
              serviceAreaData.locationText || userData?.location_city || ""
            }
          />
        </div>
      </div>
    </section>
  );
}
