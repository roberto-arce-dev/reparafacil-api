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
import { GarantiaService } from './garantia.service';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Garantia')
@ApiBearerAuth('JWT-auth')
@Controller('garantia')
export class GarantiaController {
  constructor(
    private readonly garantiaService: GarantiaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Garantia' })
  @ApiBody({ type: CreateGarantiaDto })
  @ApiResponse({ status: 201, description: 'Garantia creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createGarantiaDto: CreateGarantiaDto) {
    const data = await this.garantiaService.create(createGarantiaDto);
    return {
      success: true,
      message: 'Garantia creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Garantia' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Garantia' })
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
  @ApiResponse({ status: 404, description: 'Garantia no encontrado' })
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
    const updated = await this.garantiaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { garantia: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Garantias' })
  @ApiResponse({ status: 200, description: 'Lista de Garantias' })
  async findAll() {
    const data = await this.garantiaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Garantia por ID' })
  @ApiParam({ name: 'id', description: 'ID del Garantia' })
  @ApiResponse({ status: 200, description: 'Garantia encontrado' })
  @ApiResponse({ status: 404, description: 'Garantia no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.garantiaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Garantia' })
  @ApiParam({ name: 'id', description: 'ID del Garantia' })
  @ApiBody({ type: UpdateGarantiaDto })
  @ApiResponse({ status: 200, description: 'Garantia actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Garantia no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateGarantiaDto: UpdateGarantiaDto
  ) {
    const data = await this.garantiaService.update(id, updateGarantiaDto);
    return {
      success: true,
      message: 'Garantia actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Garantia' })
  @ApiParam({ name: 'id', description: 'ID del Garantia' })
  @ApiResponse({ status: 200, description: 'Garantia eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Garantia no encontrado' })
  async remove(@Param('id') id: string) {
    const garantia = await this.garantiaService.findOne(id);
    if (garantia.imagen) {
      const filename = garantia.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.garantiaService.remove(id);
    return { success: true, message: 'Garantia eliminado exitosamente' };
  }
}
