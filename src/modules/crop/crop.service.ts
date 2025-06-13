import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    const existing = await this.cropRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Já existe uma cultura com esse nome.');
    }
    const crop = this.cropRepository.create({
      name: dto.name,
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
      throw new NotFoundException(`Cultura não encontrada.`);
    }

    return crop;
  }

  async findAll(): Promise<Crop[]> {
    try {
      return this.cropRepository.find({ relations: ['harvest'] });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar culturas.');
    }
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
