import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TecnicoProfileService } from './tecnico-profile.service';
import { CreateTecnicoProfileDto } from './dto/create-tecnico-profile.dto';
import { UpdateTecnicoProfileDto } from './dto/update-tecnico-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('tecnico-profile')
@ApiBearerAuth()
@Controller('tecnico-profile')
export class TecnicoProfileController {
  constructor(private readonly tecnicoprofileService: TecnicoProfileService) {}

  @Get('me')
  @Roles(Role.TECNICO)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.tecnicoprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.TECNICO)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateTecnicoProfileDto) {
    return this.tecnicoprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.tecnicoprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.tecnicoprofileService.findByUserId(userId);
  }
}
