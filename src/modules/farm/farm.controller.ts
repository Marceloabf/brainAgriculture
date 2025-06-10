import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    try {
      const farm = this.farmRepository.create(createFarmDto);
      return await this.farmRepository.save(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao criar a fazenda.');
    }
  }

  async findAll(): Promise<Farm[]> {
    return await this.farmRepository.find({
      relations: ['producer', 'harvests'],
    });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'harvests'],
    });

    if (!farm) {
      throw new NotFoundException(`Fazenda com id ${id} não encontrada.`);
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id); 

    Object.assign(farm, updateFarmDto);

    try {
      return await this.farmRepository.save(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar a fazenda.');
    }
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id); 
    try {
      await this.farmRepository.remove(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao deletar a fazenda.');
    }
  }
}
