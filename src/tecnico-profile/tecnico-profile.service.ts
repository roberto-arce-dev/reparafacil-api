import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TecnicoProfile, TecnicoProfileDocument } from './schemas/tecnico-profile.schema';
import { CreateTecnicoProfileDto } from './dto/create-tecnico-profile.dto';
import { UpdateTecnicoProfileDto } from './dto/update-tecnico-profile.dto';

@Injectable()
export class TecnicoProfileService {
  constructor(
    @InjectModel(TecnicoProfile.name) private tecnicoprofileModel: Model<TecnicoProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateTecnicoProfileDto): Promise<TecnicoProfile> {
    const profile = await this.tecnicoprofileModel.create({
      user: userId,
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<TecnicoProfile | null> {
    return this.tecnicoprofileModel.findOne({ user: userId }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<TecnicoProfile[]> {
    return this.tecnicoprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateTecnicoProfileDto): Promise<TecnicoProfile> {
    const profile = await this.tecnicoprofileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.tecnicoprofileModel.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}
