import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Agenda')
@ApiBearerAuth('JWT-auth')
@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Agenda' })
  @ApiBody({ type: CreateAgendaDto })
  @ApiResponse({ status: 201, description: 'Agenda creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createAgendaDto: CreateAgendaDto) {
    const data = await this.agendaService.create(createAgendaDto);
    return {
      success: true,
      message: 'Agenda creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Agenda' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Agenda' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Agenda no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.agendaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { agenda: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Agendas' })
  @ApiResponse({ status: 200, description: 'Lista de Agendas' })
  async findAll() {
    const data = await this.agendaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Agenda por ID' })
  @ApiParam({ name: 'id', description: 'ID del Agenda' })
  @ApiResponse({ status: 200, description: 'Agenda encontrado' })
  @ApiResponse({ status: 404, description: 'Agenda no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.agendaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Agenda' })
  @ApiParam({ name: 'id', description: 'ID del Agenda' })
  @ApiBody({ type: UpdateAgendaDto })
  @ApiResponse({ status: 200, description: 'Agenda actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Agenda no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateAgendaDto: UpdateAgendaDto
  ) {
    const data = await this.agendaService.update(id, updateAgendaDto);
    return {
      success: true,
      message: 'Agenda actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Agenda' })
  @ApiParam({ name: 'id', description: 'ID del Agenda' })
  @ApiResponse({ status: 200, description: 'Agenda eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Agenda no encontrado' })
  async remove(@Param('id') id: string) {
    const agenda = await this.agendaService.findOne(id);
    if (agenda.imagen) {
      const filename = agenda.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.agendaService.remove(id);
    return { success: true, message: 'Agenda eliminado exitosamente' };
  }
}
