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