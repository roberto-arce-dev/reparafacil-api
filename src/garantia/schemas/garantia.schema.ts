import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GarantiaDocument = Garantia & Document;

@Schema({ timestamps: true })
export class Garantia {
  @Prop({ type: Types.ObjectId, ref: 'Reparacion', required: true,  unique: true  })
  reparacion: Types.ObjectId;

  @Prop({ default: 3, min: 0 })
  meses?: number;

  @Prop()
  descripcion?: string;

  @Prop()
  vigenciaHasta?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const GarantiaSchema = SchemaFactory.createForClass(Garantia);

GarantiaSchema.index({ reparacion: 1 });
