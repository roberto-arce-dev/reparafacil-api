import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import { UpdateReparacionDto } from './dto/update-reparacion.dto';
import { Reparacion, ReparacionDocument } from './schemas/reparacion.schema';

@Injectable()
export class ReparacionService {
  constructor(
    @InjectModel(Reparacion.name) private reparacionModel: Model<ReparacionDocument>,
  ) {}

  async create(createReparacionDto: CreateReparacionDto): Promise<Reparacion> {
    const nuevoReparacion = await this.reparacionModel.create(createReparacionDto);
    return nuevoReparacion;
  }

  async findAll(): Promise<Reparacion[]> {
    const reparacions = await this.reparacionModel.find();
    return reparacions;
  }

  async findOne(id: string | number): Promise<Reparacion> {
    const reparacion = await this.reparacionModel.findById(id)
    .populate('cliente', 'nombre email telefono')
    .populate('tecnico', 'nombre especialidad calificacion');
    if (!reparacion) {
      throw new NotFoundException(`Reparacion con ID ${id} no encontrado`);
    }
    return reparacion;
  }

  async update(id: string | number, updateReparacionDto: UpdateReparacionDto): Promise<Reparacion> {
    const reparacion = await this.reparacionModel.findByIdAndUpdate(id, updateReparacionDto, { new: true })
    .populate('cliente', 'nombre email telefono')
    .populate('tecnico', 'nombre especialidad calificacion');
    if (!reparacion) {
      throw new NotFoundException(`Reparacion con ID ${id} no encontrado`);
    }
    return reparacion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.reparacionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Reparacion con ID ${id} no encontrado`);
    }
  }
}
