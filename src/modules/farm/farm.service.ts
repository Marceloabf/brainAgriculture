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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/dto/pagination-result.dto';

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
    this.logger.log(`Tentativa de criar fazenda: ${JSON.stringify(dto)}`);

    const producer = await this.producerRepository.findOne({
      where: { id: dto.producerId },
    });

    if (!producer) {
      this.logger.error(`Produtor com ID ${dto.producerId} não encontrado.`);
      throw new NotFoundException('Produtor informado não foi encontrado.');
    }

    if (dto.totalArea < dto.agriculturalArea + dto.vegetationArea) {
      this.logger.error(
        `A soma das áreas agrícola (${dto.agriculturalArea}) e de vegetação (${dto.vegetationArea}) não pode ser maior que a área total (${dto.totalArea}).`,
      );
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
      const saved = await this.farmRepository.save(farm);
      this.logger.log(`Fazenda criada com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Erro ao salvar a fazenda.', error.stack);
      throw new InternalServerErrorException('Erro ao salvar a fazenda.');
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginationResult<Farm>> {
   this.logger.log('Buscando todas as fazendas');
  const { page = 1, limit = 10 } = paginationQuery;

    try {
      const [items, totalItems] = await this.farmRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['producer', 'harvests'],
      });

      this.logger.log(`Retornadas ${items.length} fazendas`);
      return {
        data: items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: Number(limit),
          totalPages: Math.ceil(totalItems / Number(limit)),
          currentPage: Number(page),
        },
      };
    } catch (error) {
      this.logger.error('Erro ao buscar fazendas.', error.stack);
      throw new InternalServerErrorException('Erro ao buscar fazendas.');
    }
  }

  async findOne(id: string): Promise<Farm> {
     this.logger.log(`Buscando fazenda com ID: ${id}`);

    try {
      const farm = await this.farmRepository.findOne({
        where: { id },
        relations: ['producer', 'harvests'],
      });

      if (!farm) {
        this.logger.error(`Fazenda com ID ${id} não encontrada.`);
        throw new NotFoundException('Fazenda não encontrada.');
      }

      this.logger.log(`Fazenda encontrada: ID ${farm.id}`);
      return farm;
    } catch (error) {
      this.logger.error(`Erro ao buscar fazenda ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Erro ao buscar fazenda.');
    }
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
   this.logger.log(`Atualizando fazenda ID ${id} com dados: ${JSON.stringify(dto)}`);

    const existingFarm = await this.farmRepository.findOne({ where: { id } });
    if (!existingFarm) {
      this.logger.error(`Fazenda com ID ${id} não encontrada.`);
      throw new NotFoundException(`Fazenda não encontrada.`);
    }

    let producer = existingFarm.producer;

    if (dto.producerId && dto.producerId !== producer?.id) {
      const foundProducer = await this.producerRepository.findOne({
        where: { id: dto.producerId },
      });

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

    try {
      const saved = await this.farmRepository.save(updatedFarm);
      this.logger.log(`Fazenda atualizada com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Erro ao salvar a fazenda atualizada ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar a fazenda.');
    }
  }


  async remove(id: string): Promise<void> {
     this.logger.log(`Removendo fazenda ID ${id}`);

    const farm = await this.findOne(id);
    if (!farm) {
      this.logger.error(`Fazenda com ID ${id} não encontrada.`);
      throw new NotFoundException('Fazenda não encontrada.');
    }

    try {
      await this.farmRepository.remove(farm);
      this.logger.log(`Fazenda removida com sucesso: ID ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover fazenda ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao remover a fazenda.');
    }
  }
}
