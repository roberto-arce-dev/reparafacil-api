import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TecnicoService } from './tecnico.service';
import { TecnicoController } from './tecnico.controller';
import { UploadModule } from '../upload/upload.module';
import { Tecnico, TecnicoSchema } from './schemas/tecnico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tecnico.name, schema: TecnicoSchema }]),
    UploadModule,
  ],
  controllers: [TecnicoController],
  providers: [TecnicoService],
  exports: [TecnicoService],
})
export class TecnicoModule {}
