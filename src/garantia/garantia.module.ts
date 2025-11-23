import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GarantiaService } from './garantia.service';
import { GarantiaController } from './garantia.controller';
import { UploadModule } from '../upload/upload.module';
import { Garantia, GarantiaSchema } from './schemas/garantia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Garantia.name, schema: GarantiaSchema }]),
    UploadModule,
  ],
  controllers: [GarantiaController],
  providers: [GarantiaService],
  exports: [GarantiaService],
})
export class GarantiaModule {}
