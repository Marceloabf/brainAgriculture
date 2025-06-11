import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { Producer } from '../producer/entities/producer.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
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
      throw new NotFoundException('Produtor informado não foi encontrado.');
    }

    if (
      dto.totalArea < dto.agriculturalArea + dto.vegetationArea
    ) {
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
      throw new NotFoundException('Fazenda não encontrada.');
    }

    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
  const existingFarm = await this.farmRepository.findOne({ where: { id } });
  if (!existingFarm) {
    throw new NotFoundException(`Fazenda com ID '${id}' não encontrada.`);
  }

  let producer = existingFarm.producer;

  if (dto.producerId && dto.producerId !== producer?.id) {
    const foundProducer = await this.producerRepository.findOne({ where: { id: dto.producerId } });

    if (!foundProducer) {
      throw new NotFoundException(`Produtor com ID '${dto.producerId}' não encontrado.`);
    }

    producer = foundProducer;
  }

  const updatedFarm = await this.farmRepository.preload({
    id,
    ...dto,
    producer,
  });

  if (!updatedFarm) {
    throw new NotFoundException(`Erro ao atualizar a fazenda. Verifique os dados.`);
  }

  return this.farmRepository.save(updatedFarm);
}


  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);

    try {
      await this.farmRepository.remove(farm);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover a fazenda.');
    }
  }
}
