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
              <Link key={event.ID} href={`/event/${event.ID}`} className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all">
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