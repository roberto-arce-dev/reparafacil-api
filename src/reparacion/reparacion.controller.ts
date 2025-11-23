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
import { ReparacionService } from './reparacion.service';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import { UpdateReparacionDto } from './dto/update-reparacion.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Reparacion')
@ApiBearerAuth('JWT-auth')
@Controller('reparacion')
export class ReparacionController {
  constructor(
    private readonly reparacionService: ReparacionService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Reparacion' })
  @ApiBody({ type: CreateReparacionDto })
  @ApiResponse({ status: 201, description: 'Reparacion creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createReparacionDto: CreateReparacionDto) {
    const data = await this.reparacionService.create(createReparacionDto);
    return {
      success: true,
      message: 'Reparacion creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Reparacion' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Reparacion' })
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
  @ApiResponse({ status: 404, description: 'Reparacion no encontrado' })
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
    const updated = await this.reparacionService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { reparacion: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Reparacions' })
  @ApiResponse({ status: 200, description: 'Lista de Reparacions' })
  async findAll() {
    const data = await this.reparacionService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Reparacion por ID' })
  @ApiParam({ name: 'id', description: 'ID del Reparacion' })
  @ApiResponse({ status: 200, description: 'Reparacion encontrado' })
  @ApiResponse({ status: 404, description: 'Reparacion no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.reparacionService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Reparacion' })
  @ApiParam({ name: 'id', description: 'ID del Reparacion' })
  @ApiBody({ type: UpdateReparacionDto })
  @ApiResponse({ status: 200, description: 'Reparacion actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reparacion no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateReparacionDto: UpdateReparacionDto
  ) {
    const data = await this.reparacionService.update(id, updateReparacionDto);
    return {
      success: true,
      message: 'Reparacion actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Reparacion' })
  @ApiParam({ name: 'id', description: 'ID del Reparacion' })
  @ApiResponse({ status: 200, description: 'Reparacion eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reparacion no encontrado' })
  async remove(@Param('id') id: string) {
    const reparacion = await this.reparacionService.findOne(id);
    if (reparacion.imagen) {
      const filename = reparacion.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.reparacionService.remove(id);
    return { success: true, message: 'Reparacion eliminado exitosamente' };
  }
}
