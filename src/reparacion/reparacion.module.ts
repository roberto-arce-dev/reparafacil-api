import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReparacionService } from './reparacion.service';
import { ReparacionController } from './reparacion.controller';
import { UploadModule } from '../upload/upload.module';
import { Reparacion, ReparacionSchema } from './schemas/reparacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reparacion.name, schema: ReparacionSchema }]),
    UploadModule,
  ],
  controllers: [ReparacionController],
  providers: [ReparacionService],
  exports: [ReparacionService],
})
export class ReparacionModule {}
