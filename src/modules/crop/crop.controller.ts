import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    try {
      const crop = this.cropRepository.create(createCropDto);
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao criar a safra (crop).');
    }
  }

  async findAll(): Promise<Crop[]> {
    return await this.cropRepository.find({
      relations: ['harvest'], 
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: ['harvest'],
    });

    if (!crop) {
      throw new NotFoundException(`Safra (crop) com id ${id} não encontrada.`);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);

    Object.assign(crop, updateCropDto);

    try {
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar a safra (crop).');
    }
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);

    try {
      await this.cropRepository.remove(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao deletar a safra (crop).');
    }
  }
}
