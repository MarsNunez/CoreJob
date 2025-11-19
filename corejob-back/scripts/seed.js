import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";
import { ProfileModel } from "../models/Profile.js";
import { CategoryModel } from "../models/Category.js";
import { ServiceModel } from "../models/Service.js";
import { PortfolioItemModel } from "../models/PortfolioItem.js";
import { BookingModel } from "../models/Booking.js";
import { ReviewModel } from "../models/Review.js";
import { NotificationModel } from "../models/Notification.js";

dotenv.config();

const DB_URL = process.env.DB_URL;

const connectDB = async () => {
  if (!DB_URL) {
    throw new Error("DB_URL no está definido en las variables de entorno");
  }
  await mongoose.connect(DB_URL);
  console.log("✅ Conectado a MongoDB");
};

const clearCollections = async () => {
  await Promise.all([
    BookingModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    PortfolioItemModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    ServiceModel.deleteMany({}),
    ProfileModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);
  console.log("🧹 Colecciones limpiadas");
};

const seedDatabase = async () => {
  await connectDB();
  await clearCollections();

  const categories = await CategoryModel.insertMany([
    {
      name: "Fontanería",
      description:
        "Reparaciones e instalaciones de agua para el hogar y oficinas.",
      icon: "fa-solid fa-faucet-drip",
    },
    {
      name: "Electricidad",
      description: "Instalaciones eléctricas, mantenimiento y emergencias.",
      icon: "fa-solid fa-bolt",
    },
    {
      name: "Limpieza",
      description: "Servicios de limpieza profunda y mantenimiento.",
      icon: "fa-solid fa-broom",
    },
    {
      name: "Carpintería",
      description: "Muebles a medida, reparaciones y acabados.",
      icon: "fa-solid fa-ruler-combined",
    },
    {
      name: "Jardinería",
      description: "Diseño, mantenimiento y paisajismo exterior.",
      icon: "fa-solid fa-leaf",
    },
  ]);
  console.log(`🌱 Categorías creadas: ${categories.length}`);

  const password = await bcrypt.hash("1", 10);

  const users = await UserModel.insertMany([
    {
      full_name: "Carlos Lock",
      email: "carlos@corejob.com",
      password,
      role: "provider",
      phone: "+34 600 111 222",
      location_country: "España",
      location_city: "Madrid",
      is_verified: true,
    },
    {
      full_name: "Lucía Andrade",
      email: "lucia@corejob.com",
      password,
      role: "provider",
      phone: "+34 600 333 444",
      location_country: "España",
      location_city: "Barcelona",
      is_verified: true,
    },
    {
      full_name: "Mars Lock",
      email: "marcelo@corejob.com",
      password,
      role: "client",
      phone: "+34 600 555 666",
      location_country: "España",
      location_city: "Madrid",
    },
    {
      full_name: "Helena Ramos",
      email: "helena@corejob.com",
      password,
      role: "client",
      phone: "+34 600 777 888",
      location_country: "España",
      location_city: "Sevilla",
    },
  ]);
  console.log(`👥 Usuarios creados: ${users.length}`);

  const [carlos, lucia, marcelo, helena] = users;

  const profiles = await ProfileModel.insertMany([
    {
      user_id: carlos._id,
      bio: "Fontanero certificado con 10 años de experiencia en reformas completas y emergencias.",
      profile_picture:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=600&q=80",
      availability_calendar: {
        lunes: "09:00-18:00",
        martes: "09:00-18:00",
        miercoles: "09:00-18:00",
        jueves: "09:00-18:00",
        viernes: "09:00-17:00",
        responseTime: "Responde en 2 horas",
        map_url:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.011199217522!2d-3.707398484603539!3d40.416775979263154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287c9c7ad359%3A0x4e725f0c60211472!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses",
        radius: "Hasta 25 km",
      },
      rating_average: 4.8,
      jobs_completed: 180,
      categories: [categories[0]._id, categories[2]._id],
    },
    {
      user_id: lucia._id,
      bio: "Electricista industrial y residencial especializada en automatización.",
      profile_picture:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=600&q=80",
      availability_calendar: {
        lunes: "08:00-17:00",
        martes: "08:00-17:00",
        jueves: "08:00-17:00",
        viernes: "08:00-15:00",
        responseTime: "Responde el mismo día",
        map_url:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.4775936010406!2d2.1685982154886073!3d41.38506397926453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f1b5b6375b%3A0x8a1dde2f3d806b51!2sPla%C3%A7a%20de%20Catalunya%2C%20Barcelona!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses",
        radius: "Hasta 15 km",
      },
      rating_average: 4.6,
      jobs_completed: 95,
      categories: [categories[1]._id, categories[3]._id],
    },
  ]);
  console.log(`👤 Perfiles creados: ${profiles.length}`);

  const [carlosProfile, luciaProfile] = profiles;

  const services = await ServiceModel.insertMany([
    {
      user_id: carlos._id,
      categores_id: [categories[0]._id],
      title: "Instalación completa de baño",
      description:
        "Reforma integral de baño con grifería premium, azulejos y fontanería nueva.",
      price_type: "por proyecto",
      price: 1800,
      estimated_duration: "5 días",
      location: "Madrid y alrededores",
      photos: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      ],
      materials_included: true,
      discount_aplied: true,
      discount_recurring: 10,
      requirements: "Visita previa para elaborar presupuesto final.",
      is_active: true,
    },
    {
      user_id: carlos._id,
      categores_id: [categories[2]._id],
      title: "Limpieza profunda post reforma",
      description:
        "Servicio profesional de limpieza para viviendas recién reformadas.",
      price_type: "por metro cuadrado",
      price: 6,
      estimated_duration: "8 horas",
      location: "Madrid centro",
      photos: [
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      ],
      materials_included: true,
      discount_aplied: false,
      discount_recurring: 0,
      requirements: "Espacio desocupado durante la limpieza.",
      is_active: true,
    },
    {
      user_id: lucia._id,
      categores_id: [categories[1]._id],
      title: "Instalación de iluminación inteligente",
      description:
        "Asesoría e instalación de sistemas de iluminación smart (Philips Hue, LIFX, etc).",
      price_type: "por hora",
      price: 45,
      estimated_duration: "2-4 horas",
      location: "Barcelona",
      photos: [
        "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1200&q=80",
      ],
      materials_included: false,
      discount_aplied: false,
      discount_recurring: 0,
      requirements: "Cliente proporciona el hardware.",
      is_active: true,
    },
  ]);
  console.log(`🛠️ Servicios creados: ${services.length}`);

  const portfolioItems = await PortfolioItemModel.insertMany([
    {
      profile_id: carlosProfile._id,
      title: "Renovación integral de baño en Chamberí",
      description:
        "Reforma completa con microcemento y grifería de bajo consumo.",
      image_url:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    },
    {
      profile_id: luciaProfile._id,
      title: "Oficina domotizada en Eixample",
      description: "Instalación de sensores, iluminación y paneles de control.",
      image_url:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    },
  ]);
  console.log(`🖼️ Portafolio creado: ${portfolioItems.length}`);

  const bookings = await BookingModel.insertMany([
    {
      client_id: marcelo._id,
      provider_id: carlos._id,
      service_id: services[0]._id,
      status: "pendiente",
      request_date: new Date(),
      scheduled_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      total_price: 1800,
      notes: "Necesito incluir instalación de mampara.",
      payment_status: "pendiente",
    },
    {
      client_id: helena._id,
      provider_id: lucia._id,
      service_id: services[2]._id,
      status: "completada",
      request_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      scheduled_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      total_price: 320,
      notes: "Integrar con asistente de voz.",
      payment_status: "pagado",
    },
  ]);
  console.log(`📅 Reservas creadas: ${bookings.length}`);

  const reviews = await ReviewModel.insertMany([
    {
      user_id: marcelo._id,
      service_id: services[0]._id,
      rating: 5,
      comment: "Carlos hizo un trabajo impecable y muy profesional.",
      date: new Date(),
      is_anonymous: false,
    },
    {
      user_id: helena._id,
      service_id: services[2]._id,
      rating: 4,
      comment: "Instalación rápida, volvería a contratarla.",
      date: new Date(),
      is_anonymous: false,
    },
  ]);
  console.log(`⭐ Reseñas creadas: ${reviews.length}`);

  const notifications = await NotificationModel.insertMany([
    {
      user_id: carlos._id,
      booking_id: bookings[0]._id,
      message: "Tienes una nueva solicitud pendiente de confirmación.",
      is_read: false,
    },
    {
      user_id: lucia._id,
      booking_id: bookings[1]._id,
      message: "Helena calificó tu servicio con 4 estrellas.",
      is_read: false,
    },
  ]);
  console.log(`🔔 Notificaciones creadas: ${notifications.length}`);

  console.log("🎉 Seed completado con éxito");
};

seedDatabase()
  .catch((error) => {
    console.error("❌ Error durante el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("🔌 Conexión cerrada");
  });
