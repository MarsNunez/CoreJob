"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_POSITION = [40.4168, -3.7038]; // Madrid por defecto

const formatNominatimAddress = (address = {}) => {
  const parts = [];
  const department = address.state || address.region || address.state_district;
  if (department) parts.push(department);

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.hamlet;
  if (city) parts.push(city);

  const district =
    address.city_district ||
    address.district ||
    address.suburb ||
    address.neighbourhood;
  if (district) parts.push(district);

  const road = [address.road, address.house_number].filter(Boolean).join(" ");
  if (road) parts.push(road);

  return parts.filter(Boolean).join(", ");
};

const reverseGeocode = async ([lat, lng]) => {
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`
  );
  if (!resp.ok) {
    throw new Error("No se pudo obtener la dirección exacta.");
  }
  const data = await resp.json();
  const formatted =
    formatNominatimAddress(data.address) || data.display_name || "";
  return formatted;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  if (!position) return null;
  return (
    <Marker position={position} icon={markerIcon}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
};

const ResizeOnShow = ({ deps = [] }) => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const FlyToPosition = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);
  return null;
};

export default function MapPickerModal({
  open,
  onClose,
  onConfirm,
  initialPosition,
  initialAddress,
}) {
  const [position, setPosition] = useState(initialPosition || DEFAULT_POSITION);
  const [address, setAddress] = useState(initialAddress || "");
  const [autoAddress, setAutoAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [error, setError] = useState("");
  const addressEditedRef = useRef(Boolean(initialAddress));
  const mapKey = useMemo(
    () => `${open ? "open" : "closed"}-${initialAddress || "addr"}`,
    [open, initialAddress]
  );

  const updatePosition = (coords) => {
    setPosition(coords);
    addressEditedRef.current = false;
  };

  useEffect(() => {
    if (open) {
      setError("");
      setPosition(initialPosition || DEFAULT_POSITION);
      setAddress(initialAddress || "");
      setAutoAddress("");
      addressEditedRef.current = Boolean(initialAddress);
    }
  }, [open, initialPosition, initialAddress]);

  useEffect(() => {
    if (!open || !position) return;
    let cancelled = false;
    const fetchAddress = async () => {
      setResolvingAddress(true);
      try {
        const formatted = await reverseGeocode(position);
        if (cancelled) return;
        setAutoAddress(formatted);
        if (!addressEditedRef.current) {
          setAddress(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setResolvingAddress(false);
      }
    };
    fetchAddress();
    return () => {
      cancelled = true;
    };
  }, [open, position]);

  const geocode = async () => {
    if (!address.trim()) return;
    setSearching(true);
    setError("");
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address.trim()
        )}`
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const best = data[0];
        updatePosition([Number(best.lat), Number(best.lon)]);
      } else {
        setError("No se encontró esa dirección. Intenta con más detalles.");
      }
    } catch (err) {
      setError("No se pudo buscar la dirección.");
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!position) {
      setError("Selecciona una ubicación en el mapa.");
      return;
    }
    setError("");
    const mapUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}&output=embed`;
    let finalAddress = address.trim() || autoAddress.trim();

    if (!finalAddress) {
      try {
        finalAddress = await reverseGeocode(position);
      } catch (err) {
        console.error(err);
      }
    }

    onConfirm({
      address: finalAddress,
      lat: position[0],
      lng: position[1],
      mapUrl,
    });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1621] text-white shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              Seleccionar ubicación
            </p>
            <h3 className="text-lg font-semibold">Elige tu dirección en el mapa</h3>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full border border-white/10 text-white transition hover:bg-white/10"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b28]">
            <MapContainer
              key={mapKey}
              center={position}
              zoom={13}
              className="h-[420px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} onSelect={updatePosition} />
              <ResizeOnShow deps={[open, position]} />
              <FlyToPosition position={position} />
            </MapContainer>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0d1b28] p-4 text-sm">
            <label className="flex flex-col gap-2 text-slate-200">
              Buscar dirección
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    addressEditedRef.current = true;
                    setAddress(e.target.value);
                  }}
                  className="flex-1 rounded-2xl border border-white/10 bg-[#0f2333] px-3 py-2 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/40"
                  placeholder="Ej. Calle, ciudad, país"
                />
                <button
                  type="button"
                  disabled={searching}
                  onClick={geocode}
                  className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                >
                  {searching ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </label>

            <p className="text-xs text-slate-400">
              También puedes hacer clic en el mapa para mover el marcador.
            </p>

            {position && (
              <div className="rounded-xl border border-white/10 bg-[#0f2333] p-3 text-xs text-slate-200">
                <p className="font-semibold text-white">Coordenadas</p>
                <p>Lat: {position[0].toFixed(5)}</p>
                <p>Lng: {position[1].toFixed(5)}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}
            {resolvingAddress && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
                Obteniendo dirección precisa...
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
