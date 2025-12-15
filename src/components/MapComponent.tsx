'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IEvent } from '@/lib/models/Event';
import { getCoords } from '@/lib/locations';
import L from 'leaflet';

// Fix iconos Leaflet
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = icon;

interface MapProps {
  events: IEvent[];
}

const MapComponent = ({ events }: MapProps) => {
  const center: [number, number] = [37.8915, -6.5626];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-emerald-100 z-0 relative">
      <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const coords = getCoords(event['Pueblo']);
          return (
            <Marker key={event.ID} position={[coords.lat, coords.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong className="block text-emerald-800">{event['Título']}</strong>
                  <span>{event['Pueblo']}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;