import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { UploadModule } from '../upload/upload.module';
import { Agenda, AgendaSchema } from './schemas/agenda.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agenda.name, schema: AgendaSchema }]),
    UploadModule,
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
