import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Farm } from '../farm/entities/farm.entity';

@Injectable()
export class HarvestService {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,

    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(dto: CreateHarvestDto): Promise<Harvest> {
    const farm = await this.farmRepository.findOne({ where: { id: dto.farmId } });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada.');
    }

    const existing = await this.harvestRepository.findOne({
      where: {
        name: dto.name,
        farm: { id: dto.farmId },
      },
    });

    if (existing) {
      throw new ConflictException('Já existe uma safra com esse nome para esta fazenda.');
    }

    const harvest = this.harvestRepository.create({
      name: dto.name,
      farm,
      crops: dto.crops || [],
    });

    return this.harvestRepository.save(harvest);
  }

  async findAll(): Promise<Harvest[]> {
    return this.harvestRepository.find({ relations: ['farm'] });
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestRepository.findOne({
      where: { id },
      relations: ['farm'],
    });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada.');
    }

    return harvest;
  }

  async update(id: string, dto: UpdateHarvestDto): Promise<Harvest> {
    const harvest = await this.harvestRepository.findOneBy({ id });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada.');
    }

    if (dto.farmId) {
      const farm = await this.farmRepository.findOneBy({ id: dto.farmId });
      if (!farm) {
        throw new NotFoundException('Nova fazenda associada não foi encontrada.');
      }
      harvest.farm = farm;
    }

    if (dto.name) {
      const conflict = await this.harvestRepository.findOne({
        where: {
          name: dto.name,
          farm: { id: dto.farmId ?? harvest.farm.id },
        },
      });

      if (conflict && conflict.id !== id) {
        throw new ConflictException('Já existe uma safra com esse nome para esta fazenda.');
      }

      harvest.name = dto.name;
    }

    return this.harvestRepository.save(harvest);
  }

  async remove(id: string): Promise<void> {
    const harvest = await this.harvestRepository.findOneBy({ id });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada.');
    }

    await this.harvestRepository.remove(harvest);
  }
}
