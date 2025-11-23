import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReparacionDocument = Reparacion & Document;

@Schema({ timestamps: true })
export class Reparacion {
  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  cliente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tecnico' })
  tecnico: Types.ObjectId;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ default: 0, min: 0 })
  costo?: number;

  @Prop({ enum: ['solicitada', 'asignada', 'en-proceso', 'completada', 'cancelada'], default: 'solicitada' })
  estado?: string;

  @Prop()
  fechaServicio?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ReparacionSchema = SchemaFactory.createForClass(Reparacion);

ReparacionSchema.index({ cliente: 1 });
ReparacionSchema.index({ tecnico: 1 });
ReparacionSchema.index({ estado: 1 });
