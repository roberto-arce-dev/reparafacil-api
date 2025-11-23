import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Agenda, AgendaDocument } from './schemas/agenda.schema';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(Agenda.name) private agendaModel: Model<AgendaDocument>,
  ) {}

  async create(createAgendaDto: CreateAgendaDto): Promise<Agenda> {
    const nuevoAgenda = await this.agendaModel.create(createAgendaDto);
    return nuevoAgenda;
  }

  async findAll(): Promise<Agenda[]> {
    const agendas = await this.agendaModel.find();
    return agendas;
  }

  async findOne(id: string | number): Promise<Agenda> {
    const agenda = await this.agendaModel.findById(id)
    .populate('tecnico', 'nombre especialidad');
    if (!agenda) {
      throw new NotFoundException(`Agenda con ID ${id} no encontrado`);
    }
    return agenda;
  }

  async update(id: string | number, updateAgendaDto: UpdateAgendaDto): Promise<Agenda> {
    const agenda = await this.agendaModel.findByIdAndUpdate(id, updateAgendaDto, { new: true })
    .populate('tecnico', 'nombre especialidad');
    if (!agenda) {
      throw new NotFoundException(`Agenda con ID ${id} no encontrado`);
    }
    return agenda;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.agendaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Agenda con ID ${id} no encontrado`);
    }
  }
}
