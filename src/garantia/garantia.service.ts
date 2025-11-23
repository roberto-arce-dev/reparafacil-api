import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { Garantia, GarantiaDocument } from './schemas/garantia.schema';

@Injectable()
export class GarantiaService {
  constructor(
    @InjectModel(Garantia.name) private garantiaModel: Model<GarantiaDocument>,
  ) {}

  async create(createGarantiaDto: CreateGarantiaDto): Promise<Garantia> {
    const nuevoGarantia = await this.garantiaModel.create(createGarantiaDto);
    return nuevoGarantia;
  }

  async findAll(): Promise<Garantia[]> {
    const garantias = await this.garantiaModel.find();
    return garantias;
  }

  async findOne(id: string | number): Promise<Garantia> {
    const garantia = await this.garantiaModel.findById(id)
    .populate('reparacion', 'descripcion costo estado');
    if (!garantia) {
      throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
    }
    return garantia;
  }

  async update(id: string | number, updateGarantiaDto: UpdateGarantiaDto): Promise<Garantia> {
    const garantia = await this.garantiaModel.findByIdAndUpdate(id, updateGarantiaDto, { new: true })
    .populate('reparacion', 'descripcion costo estado');
    if (!garantia) {
      throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
    }
    return garantia;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.garantiaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
    }
  }
}
