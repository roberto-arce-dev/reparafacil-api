import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TecnicoDocument = Tecnico & Document;

@Schema({ timestamps: true })
export class Tecnico {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  especialidad?: string;

  @Prop()
  telefono?: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: 0, min: 0, max: 5 })
  calificacion?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const TecnicoSchema = SchemaFactory.createForClass(Tecnico);

TecnicoSchema.index({ email: 1 });
TecnicoSchema.index({ especialidad: 1 });
