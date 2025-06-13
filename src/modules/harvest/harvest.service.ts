import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Farm } from '../farm/entities/farm.entity';
import { Crop } from '../crop/entities/crop.entity';

@Injectable()
export class HarvestService {
  private readonly logger = new Logger(HarvestService.name);

  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,

    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,

    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
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

  let crops: Crop[] = [];
  if (dto.crops && dto.crops.length > 0) {
    crops = await this.cropRepository.findByIds(dto.crops);

    if (crops.length !== dto.crops.length) {
      throw new BadRequestException('Alguma(s) culturas informada(s) não foram encontradas.');
    }
  }

  const harvest = this.harvestRepository.create({
    name: dto.name,
    farm,
    crops,
  });

  return this.harvestRepository.save(harvest);
}

  async findAll(): Promise<Harvest[]> {
    return this.harvestRepository.find({ relations: ['crops'] });
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestRepository.findOne({
      where: { id },
      relations: ['crops'],
    });

    if (!harvest) {
      this.logger.error(`Safra com ID ${id} não encontrada.`);
      throw new NotFoundException('Safra não encontrada.');
    }

    return harvest;
  }

async update(id: string, dto: UpdateHarvestDto): Promise<Harvest> {
  const harvest = await this.harvestRepository.findOne({
    where: { id },
    relations: ['farm'], 
  });

  if (!harvest) {
    this.logger.error(`Safra com ID ${id} não encontrada.`);
    throw new NotFoundException('Safra não encontrada.');
  }

  if (dto.farmId) {
    const farm = await this.farmRepository.findOneBy({ id: dto.farmId });
    if (!farm) {
      this.logger.error(`Fazenda com ID ${dto.farmId} não encontrada.`);
      throw new NotFoundException('Nova fazenda associada não foi encontrada.');
    }
    harvest.farm = farm;
  }

  if (dto.name) {
    const farmId = dto.farmId ?? harvest.farm?.id;

    if (!farmId) {
      this.logger.error('Tentativa de validar nome de safra sem um ID de fazenda.');
      throw new BadRequestException('Não é possível validar o nome sem um ID de fazenda.');
    }

    const conflict = await this.harvestRepository.findOne({
      where: {
        name: dto.name,
        farm: { id: farmId },
      },
    });

    if (conflict && conflict.id !== id) {
      this.logger.error(`Já existe uma safra com o nome "${dto.name}" para a fazenda com ID ${farmId}.`);
      throw new ConflictException('Já existe uma safra com esse nome para esta fazenda.');
    }

    harvest.name = dto.name;
  }

  return this.harvestRepository.save(harvest);
}

  async remove(id: string): Promise<void> {
    const harvest = await this.harvestRepository.findOneBy({ id });

    if (!harvest) {
      this.logger.error(`Safra com ID ${id} não encontrada.`);
      throw new NotFoundException('Safra não encontrada.');
    }

    await this.harvestRepository.remove(harvest);
  }
}
