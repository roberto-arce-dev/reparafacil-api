import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';
import { Tecnico, TecnicoDocument } from './schemas/tecnico.schema';

@Injectable()
export class TecnicoService {
  constructor(
    @InjectModel(Tecnico.name) private tecnicoModel: Model<TecnicoDocument>,
  ) {}

  async create(createTecnicoDto: CreateTecnicoDto): Promise<Tecnico> {
    const nuevoTecnico = await this.tecnicoModel.create(createTecnicoDto);
    return nuevoTecnico;
  }

  async findAll(): Promise<Tecnico[]> {
    const tecnicos = await this.tecnicoModel.find();
    return tecnicos;
  }

  async findOne(id: string | number): Promise<Tecnico> {
    const tecnico = await this.tecnicoModel.findById(id);
    if (!tecnico) {
      throw new NotFoundException(`Tecnico con ID ${id} no encontrado`);
    }
    return tecnico;
  }

  async update(id: string | number, updateTecnicoDto: UpdateTecnicoDto): Promise<Tecnico> {
    const tecnico = await this.tecnicoModel.findByIdAndUpdate(id, updateTecnicoDto, { new: true });
    if (!tecnico) {
      throw new NotFoundException(`Tecnico con ID ${id} no encontrado`);
    }
    return tecnico;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.tecnicoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Tecnico con ID ${id} no encontrado`);
    }
  }
}
