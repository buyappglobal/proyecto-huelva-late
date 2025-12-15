import dbConnect from '@/lib/mongodb';
import Event, { IEvent } from '@/lib/models/Event';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mapa dinámico con importación absoluta usando @
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-zinc-100 animate-pulse rounded-xl" />,
});

async function getEvent(id: string) {
    await dbConnect();
    // Buscamos por tu campo 'ID' personalizado
    const event = await Event.findOne({ ID: id }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
}

export default async function EventPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const event = (await getEvent(id)) as IEvent | null;

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Cabecera con Imagen */}
            <div className="relative h-[50vh] w-full bg-zinc-900">
                <Image
                    src={event['URL Imagen'] || 'https://placehold.co/1200x600'}
                    alt={event['Título']}
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la agenda
                    </Link>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                            {event['Categoría']}
                        </span>
                        {event['Destacado'] === 'SÍ' && (
                            <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                Destacado
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-sm">{event['Título']}</h1>
                    <div className="flex flex-col md:flex-row gap-4 text-zinc-200 text-lg">
                        <div className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-emerald-400" /> {event['Fecha Inicio']}</div>
                        <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-emerald-400" /> {event['Pueblo']}</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Columna Principal: Descripción */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Acerca del evento</h2>
                        <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed text-lg">
                            {event['Descripción']}
                        </p>
                    </div>
                </div>

                {/* Columna Lateral: Mapa y Detalles */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold p-4 pb-2">Ubicación</h3>
                        <MapComponent events={[event]} />
                    </div>
                </div>
            </div>
        </main>
    );
}