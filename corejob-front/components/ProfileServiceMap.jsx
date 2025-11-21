"use client";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export default function ProfileServiceMap({
  lat,
  lng,
  radiusMeters,
  addressTitle,
}) {
  if (typeof window === "undefined") return null;
  const center = [lat, lng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-64 w-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={markerIcon}>
        <Popup>{addressTitle || "Ubicación"}</Popup>
      </Marker>
      {radiusMeters && (
        <Circle
          center={center}
          radius={radiusMeters}
          pathOptions={{
            color: "#10b981",
            fillColor: "#10b981",
            fillOpacity: 0.1,
          }}
        />
      )}
    </MapContainer>
  );
}
