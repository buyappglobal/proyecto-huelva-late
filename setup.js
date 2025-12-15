const fs = require('fs');
const path = require('path');

// Definición de los archivos y su contenido
const files = {
  'src/lib/mongodb.ts': `
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
`,

  'src/lib/locations.ts': `
// Diccionario para mapear pueblos a coordenadas (ya que la DB no tiene lat/lng)
export const SIERRA_COORDS: Record<string, { lat: number; lng: number }> = {
  'Linares de la Sierra': { lat: 37.8805, lng: -6.6219 },
  'Aracena': { lat: 37.8915, lng: -6.5626 },
  'Alájar': { lat: 37.8744, lng: -6.6633 },
  'Cortegana': { lat: 37.9102, lng: -6.8194 },
  'Fuenteheridos': { lat: 37.9022, lng: -6.6617 },
  'Galaroza': { lat: 37.9283, lng: -6.7083 },
  'Jabugo': { lat: 37.9167, lng: -6.7292 },
  'Almonaster la Real': { lat: 37.8714, lng: -6.7883 },
  'Zufre': { lat: 37.8333, lng: -6.5000 },
  'Higuera de la Sierra': { lat: 37.8361, lng: -6.4472 },
  'default': { lat: 37.8915, lng: -6.5626 }
};

export const getCoords = (pueblo: string) => {
  return SIERRA_COORDS[pueblo] || SIERRA_COORDS['default'];
};
`,

  'src/lib/models/Event.ts': `
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IEvent extends Document {
  ID: string;
  'Título': string;
  'Pueblo': string;
  'Fecha Inicio': string;
  'Fecha Fin'?: string;
  'Categoría': string;
  'Destacado': string;
  'URL Imagen': string;
  'Descripción': string;
  _id: mongoose.Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    ID: { type: String, required: true, unique: true },
    'Título': { type: String, required: true },
    'Pueblo': { type: String, required: true },
    'Fecha Inicio': { type: String, required: true },
    'Fecha Fin': { type: String },
    'Categoría': { type: String },
    'Destacado': { type: String },
    'URL Imagen': { type: String },
    'Descripción': { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;
`,

  'src/components/MapComponent.tsx': `
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
`,

  'src/app/page.tsx': `
import dynamic from 'next/dynamic';
import dbConnect from '@/lib/mongodb';
import Event, { IEvent } from '@/lib/models/Event';
import { Tent, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-zinc-100 animate-pulse rounded-xl" />,
});

async function getEvents() {
  await dbConnect();
  const events = await Event.find({}).sort({ 'Fecha Inicio': 1 }).lean();
  return JSON.parse(JSON.stringify(events));
}

export default async function Home() {
  const events = (await getEvents()) as IEvent[];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <section className="bg-emerald-900 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Huelva <span className="text-amber-400">Late</span></h1>
        <p className="text-xl text-emerald-100">Agenda cultural de la Sierra. {events.length} eventos.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Mapa de Eventos</h2>
          <MapComponent events={events} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.ID} href={\`/event/\${event.ID}\`} className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all">
                <div className="relative h-48 bg-zinc-200">
                  <Image
                    src={event['URL Imagen'] || 'https://placehold.co/600x400'}
                    alt={event['Título']}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center text-emerald-600 text-sm font-bold mb-2">
                    <Calendar className="w-4 h-4 mr-2" /> {event['Fecha Inicio']}
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{event['Título']}</h3>
                  <div className="flex items-center text-zinc-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" /> {event['Pueblo']}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
`,
  '.env.local': `MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db?retryWrites=true&w=majority`
};

// Función para crear archivos
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Carpeta creada: ${dir}`);
  }

  fs.writeFileSync(fullPath, content.trim());
  console.log(`✅ Archivo creado: ${filePath}`);
});

console.log('\n🚀 ¡Todo listo! No olvides configurar tu .env.local con tu conexión real.');

