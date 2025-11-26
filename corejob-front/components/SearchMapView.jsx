"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Circle,
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
        html: `<div class="flex h-11 min-w-11 items-center justify-center rounded-full bg-[rgba(15,23,42,0.92)] text-[10px] font-semibold text-white shadow-lg border border-white/15 px-2">
          <span class="leading-tight text-center">${label}</span>
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
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

const ClusterOverlay = ({
  overlay,
  formatPrice,
  onSelectService,
  onClose,
}) => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!overlay) return;
    const update = () => {
      const point = map.latLngToContainerPoint(
        L.latLng(overlay.lat, overlay.lng)
      );
      setPosition(point);
    };
    update();
    map.on("move zoom", update);
    map.on("movestart", onClose);
    return () => {
      map.off("move zoom", update);
      map.off("movestart", onClose);
    };
  }, [overlay, map, onClose]);

  useEffect(() => {
    if (!overlay) return;
    const handleClickOutside = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlay, onClose]);

  if (!overlay || !position) return null;

  return (
    <div
      ref={panelRef}
      className="pointer-events-auto rounded-2xl border border-white/10 bg-[#050e17] p-3 text-xs text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,0.7)]"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -110%)",
        zIndex: 600,
        minWidth: "220px",
        maxWidth: "260px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
          {overlay.items.length} servicios cerca
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-200 hover:bg-white/10"
          aria-label="Cerrar"
        >
          <i className="fa-solid fa-xmark text-[0.6rem]" />
        </button>
      </div>
      <ul className="max-h-48 space-y-1 overflow-auto pr-1">
        {overlay.items.map(({ service }) => (
          <li key={service._id}>
            <button
              type="button"
              onClick={() => {
                onSelectService?.(service);
                onClose();
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10"
            >
              <span className="line-clamp-1 text-[11px]">
                {service.title || "Servicio"}
              </span>
              <span className="whitespace-nowrap text-[11px] text-emerald-200">
                {formatPrice(service.price, service.price_type)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function SearchMapView({
  services,
  userLocation,
  formatPrice,
  onSelectService,
  maxDistanceKm,
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

  const [clusterOverlay, setClusterOverlay] = useState(null);

  const markerGroups = useMemo(() => {
    const groups = new Map();

    services.forEach((service) => {
      const profile = service.profile || {};
      const useCustom = !!service.use_custom_location;
      const lat =
        useCustom && typeof service.service_lat === "number"
          ? service.service_lat
          : profile.service_lat;
      const lng =
        useCustom && typeof service.service_lng === "number"
          ? service.service_lng
          : profile.service_lng;
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ service, lat, lng });
    });

    return Array.from(groups.values());
  }, [services]);

  return (
    <div className="mt-4 relative overflow-hidden rounded-2xl border border-white/10 bg-[#020a10]">
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
        {userLocation && maxDistanceKm && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={maxDistanceKm * 1000}
            pathOptions={{
              color: "#22c55e",
              weight: 1.5,
              fillColor: "#22c55e",
              fillOpacity: 0.08,
            }}
          />
        )}
        {markerGroups.map((items) => {
          if (!items.length) return null;
          const { lat, lng } = items[0];
          const isCluster = items.length > 1;
          const service = items[0].service;
          const fullPrice = formatPrice(service.price, service.price_type);

          let shortLabel = "";
          if (isCluster) {
            shortLabel = `+${items.length}`;
          } else if (service.price !== null && service.price !== undefined) {
            const value = Number(service.price);
            if (!Number.isNaN(value)) {
              shortLabel = `S/ ${value.toLocaleString("es-PE", {
                maximumFractionDigits: 0,
              })}`;
            }
          }
          const icon = useDivIcon(shortLabel || (isCluster ? "+?" : "S/ -"));
          return (
            <Marker
              key={service._id}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (isCluster) {
                    setClusterOverlay({ items, lat, lng });
                  } else {
                    onSelectService?.(service);
                  }
                },
              }}
            >
              {!isCluster && (
                <Tooltip
                  direction="top"
                  offset={[0, -4]}
                  permanent={false}
                  className="price-tooltip"
                >
                  <div className="space-y-0.5 text-xs">
                    <div className="font-semibold text-white">
                      {service.title || "Servicio"}
                    </div>
                    <div className="text-emerald-200">
                      {fullPrice || "Sin precio"}
                    </div>
                  </div>
                </Tooltip>
              )}
            </Marker>
          );
        })}
        <ClusterOverlay
          overlay={clusterOverlay}
          formatPrice={formatPrice}
          onSelectService={onSelectService}
          onClose={() => setClusterOverlay(null)}
        />
      </MapContainer>
    </div>
  );
}
