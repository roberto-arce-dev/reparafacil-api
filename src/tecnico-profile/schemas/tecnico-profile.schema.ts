import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type TecnicoProfileDocument = TecnicoProfile & Document;

/**
 * TecnicoProfile - Profile de negocio para rol TECNICO
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class TecnicoProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreCompleto: string;

  @Prop()
  telefono?: string;

  @Prop()
  especialidad?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  })
  ubicacion?: {
    type: string;
    coordinates: number[];
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const TecnicoProfileSchema = SchemaFactory.createForClass(TecnicoProfile);

// Indexes para optimizar queries
TecnicoProfileSchema.index({ user: 1 });
TecnicoProfileSchema.index({ ubicacion: '2dsphere' }, { sparse: true });
