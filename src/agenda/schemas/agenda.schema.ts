import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AgendaDocument = Agenda & Document;

@Schema({ timestamps: true })
export class Agenda {
  @Prop({ type: Types.ObjectId, ref: 'Tecnico', required: true,  unique: true  })
  tecnico: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  disponibilidad?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);

AgendaSchema.index({ tecnico: 1 });
