import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  ID: string;
  'URL Imagen': string;
  'Título': string;
  'Categoría': string;
  'Destacado': string;
  'Fecha Inicio': string;
  'Pueblo': string;
  'Descripción': string;
  Latitud?: number;
  Longitud?: number;
}

const EventSchema: Schema = new Schema({
  ID: { type: String, required: true, unique: true },
  'URL Imagen': { type: String },
  'Título': { type: String, required: true },
  'Categoría': { type: String },
  'Destacado': { type: String },
  'Fecha Inicio': { type: String },
  'Pueblo': { type: String },
  'Descripción': { type: String },
  Latitud: { type: Number },
  Longitud: { type: Number },
}, { collection: 'events' });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;