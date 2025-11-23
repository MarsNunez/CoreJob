"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-12.0464, -77.0428]; // Lima

const useDivIcon = (label) =>
  useMemo(
    () =>
      new L.DivIcon({
        className: "price-marker",
        html: `<div class="flex h-9 min-w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white shadow-lg border border-white/20 px-2">${label}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    [label]
  );

const FlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom() || 12);
    }
  }, [center, map]);
  return null;
};

export default function SearchMapView({
  services,
  userLocation,
  formatPrice,
  onSelectService,
}) {
  const mapCenter = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    const withCoords = services.find(
      (service) =>
        typeof service.profile?.service_lat === "number" &&
        typeof service.profile?.service_lng === "number"
    );
    if (withCoords) {
      return [withCoords.profile.service_lat, withCoords.profile.service_lng];
    }
    return DEFAULT_CENTER;
  }, [services, userLocation]);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#020a10]">
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-[520px] w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={mapCenter} />
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: "",
              html: `<div class="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-500/30"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Tooltip direction="top" offset={[0, -8]} permanent={false}>
              Tú
            </Tooltip>
          </Marker>
        )}
        {services.map((service) => {
          const profile = service.profile || {};
          const lat = profile.service_lat;
          const lng = profile.service_lng;
          if (typeof lat !== "number" || typeof lng !== "number") return null;
          const priceLabel = formatPrice(service.price, service.price_type);
          const icon = useDivIcon(priceLabel);
          return (
            <Marker
              key={service._id}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectService?.(service),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-white">
                    {service.title || "Servicio"}
                  </div>
                  <div className="text-emerald-200">
                    {priceLabel || "Sin precio"}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

