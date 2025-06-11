import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Harvest } from './../harvest/entities/harvest.entity';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,

    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    const harvest = await this.harvestRepository.findOne({ where: { id: dto.harvestId } });

    if (!harvest) {
      throw new NotFoundException('Safra informada não encontrada.');
    }

    const crop = this.cropRepository.create({
      name: dto.name,
      harvest,
    });

    try {
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar cultura.');
    }
  }

  async findOne(id: string): Promise<Crop> {
  const crop = await this.cropRepository.findOne({
    where: { id },
    relations: ['harvest'], 
  });

  if (!crop) {
    throw new NotFoundException(`Cultura com ID '${id}' não encontrada.`);
  }

  return crop;
}

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find({ relations: ['harvest'] });
  }

  async findByHarvest(harvestId: string): Promise<Crop[]> {
    const harvest = await this.harvestRepository.findOne({ where: { id: harvestId } });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada.');
    }

    return this.cropRepository.find({ where: { harvest: { id: harvestId } } });
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      throw new NotFoundException('Cultura não encontrada.');
    }

    Object.assign(crop, dto);

    try {
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar cultura.');
    }
  }

  async remove(id: string): Promise<void> {
    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      throw new NotFoundException('Cultura não encontrada.');
    }

    try {
      await this.cropRepository.remove(crop);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover cultura.');
    }
  }
}
