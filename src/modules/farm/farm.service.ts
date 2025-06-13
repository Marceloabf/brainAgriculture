import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { Producer } from '../producer/entities/producer.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name)
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,

    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateFarmDto): Promise<Farm> {
    const producer = await this.producerRepository.findOne({
      where: { id: dto.producerId },
    });

    if (!producer) {
      this.logger.error(`Produtor com ID ${dto.producerId} não encontrado.`);
      throw new NotFoundException('Produtor informado não foi encontrado.');
    }

    if (
      dto.totalArea < (dto.agriculturalArea + dto.vegetationArea)
    ) {
      this.logger.error(`A soma das áreas agrícola e de vegetação não pode ser maior que a área total.`);
      throw new BadRequestException(
        'A soma das áreas agrícola e de vegetação não pode ser maior que a área total.',
      );
    }

    const farm = this.farmRepository.create({
      name: dto.name,
      city: dto.city,
      state: dto.state,
      totalArea: dto.totalArea,
      agriculturalArea: dto.agriculturalArea,
      vegetationArea: dto.vegetationArea,
      producer,
    });

    try {
      return await this.farmRepository.save(farm);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar a fazenda.');
    }
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({
      relations: ['producer', 'harvests'],
    });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'harvests'],
    });

    if (!farm) {
      this.logger.error(`Fazenda com ID ${id} não encontrada.`);
      throw new NotFoundException('Fazenda não encontrada.');
    }

    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
  const existingFarm = await this.farmRepository.findOne({ where: { id } });
  if (!existingFarm) {
    this.logger.error(`Fazenda com ID ${id} não encontrada.`);
    throw new NotFoundException(`Fazenda não encontrada.`);
  }

  let producer = existingFarm.producer;

  if (dto.producerId && dto.producerId !== producer?.id) {
    const foundProducer = await this.producerRepository.findOne({ where: { id: dto.producerId } });

    if (!foundProducer) {
      this.logger.error(`Produtor com ID ${dto.producerId} não encontrado.`);
      throw new NotFoundException(`Produtor não encontrado.`);
    }

    producer = foundProducer;
  }

    const totalArea = dto.totalArea ?? existingFarm.totalArea;
    const agriculturalArea = dto.agriculturalArea ?? existingFarm.agriculturalArea;
    const vegetationArea = dto.vegetationArea ?? existingFarm.vegetationArea;

    if (agriculturalArea + vegetationArea > totalArea) {
    this.logger.error(
      `A soma da área agricultável (${agriculturalArea}) e da área de vegetação (${vegetationArea}) não pode ser maior que a área total (${totalArea}).`,
    );
    throw new BadRequestException(
      'A soma da área agricultável e da área de vegetação não pode ser maior que a área total.',
    );
  }

  const updatedFarm = await this.farmRepository.preload({
    id,
    ...dto,
    producer,
  });

  if (!updatedFarm) {
    this.logger.error(`Erro ao atualizar a fazenda com ID ${id}.`);
    throw new InternalServerErrorException(`Erro ao atualizar a fazenda.`);
  }

  return this.farmRepository.save(updatedFarm);
  }


  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    if (!farm) {
      this.logger.error(`Fazenda com ID ${id} não encontrada.`);
      throw new NotFoundException('Fazenda não encontrada.');
    }

    try {
      await this.farmRepository.remove(farm);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover a fazenda.');
    }
  }
}
