import { PartialType } from '@nestjs/swagger';
import { CreateTecnicoProfileDto } from './create-tecnico-profile.dto';

export class UpdateTecnicoProfileDto extends PartialType(CreateTecnicoProfileDto) {}
