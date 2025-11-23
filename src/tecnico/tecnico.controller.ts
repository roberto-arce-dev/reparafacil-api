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
import { TecnicoService } from './tecnico.service';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Tecnico')
@ApiBearerAuth('JWT-auth')
@Controller('tecnico')
export class TecnicoController {
  constructor(
    private readonly tecnicoService: TecnicoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Tecnico' })
  @ApiBody({ type: CreateTecnicoDto })
  @ApiResponse({ status: 201, description: 'Tecnico creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createTecnicoDto: CreateTecnicoDto) {
    const data = await this.tecnicoService.create(createTecnicoDto);
    return {
      success: true,
      message: 'Tecnico creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Tecnico' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Tecnico' })
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
  @ApiResponse({ status: 404, description: 'Tecnico no encontrado' })
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
    const updated = await this.tecnicoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { tecnico: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Tecnicos' })
  @ApiResponse({ status: 200, description: 'Lista de Tecnicos' })
  async findAll() {
    const data = await this.tecnicoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Tecnico por ID' })
  @ApiParam({ name: 'id', description: 'ID del Tecnico' })
  @ApiResponse({ status: 200, description: 'Tecnico encontrado' })
  @ApiResponse({ status: 404, description: 'Tecnico no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.tecnicoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Tecnico' })
  @ApiParam({ name: 'id', description: 'ID del Tecnico' })
  @ApiBody({ type: UpdateTecnicoDto })
  @ApiResponse({ status: 200, description: 'Tecnico actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tecnico no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateTecnicoDto: UpdateTecnicoDto
  ) {
    const data = await this.tecnicoService.update(id, updateTecnicoDto);
    return {
      success: true,
      message: 'Tecnico actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Tecnico' })
  @ApiParam({ name: 'id', description: 'ID del Tecnico' })
  @ApiResponse({ status: 200, description: 'Tecnico eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tecnico no encontrado' })
  async remove(@Param('id') id: string) {
    const tecnico = await this.tecnicoService.findOne(id);
    if (tecnico.imagen) {
      const filename = tecnico.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.tecnicoService.remove(id);
    return { success: true, message: 'Tecnico eliminado exitosamente' };
  }
}
