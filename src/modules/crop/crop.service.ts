import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/dto/pagination-result.dto';

@Injectable()
export class CropService {
  private readonly logger = new Logger(CropService.name);

  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    this.logger.log(`Tentativa de criar cultura com nome: ${dto.name}`);

    const existing = await this.cropRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      this.logger.error(`Cultura com nome ${dto.name} já existe.`);
      throw new ConflictException('Já existe uma cultura com esse nome.');
    }

    const crop = this.cropRepository.create({
      name: dto.name,
    });

    try {
      const saved = await this.cropRepository.save(crop);
      this.logger.log(`Cultura salva com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Erro ao salvar cultura.', error.stack);
      throw new InternalServerErrorException('Erro ao salvar cultura.');
    }
  }

  async findOne(id: string): Promise<Crop> {
    this.logger.log(`Buscando cultura com ID: ${id}`);

    try {
      const crop = await this.cropRepository.findOne({
        where: { id },
        relations: ['harvest'],
      });

      if (!crop) {
        this.logger.error(`Cultura com ID ${id} não encontrada.`);
        throw new NotFoundException(`Cultura não encontrada.`);
      }

      this.logger.log(`Cultura encontrada: ID ${crop.id}`);
      return crop;
    } catch (error) {
      this.logger.error(`Erro ao buscar cultura ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Erro ao buscar cultura.');
    }
  }

 async findAll(paginationQuery: PaginationQueryDto): Promise<PaginationResult<Crop>> {
  this.logger.log('Buscando todas as culturas');
  const { page = 1, limit = 10 } = paginationQuery;

  try {
    const [items, totalItems] = await this.cropRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['harvest'],
    });

    this.logger.log(`Retornadas ${items.length} culturas`);
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
    this.logger.error('Erro ao buscar culturas.', error.stack);
    throw new InternalServerErrorException('Erro ao buscar culturas.');
  }
}


  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    this.logger.log(`Atualizando cultura ID ${id} com dados: ${JSON.stringify(dto)}`);

    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      this.logger.error(`Cultura com ID ${id} não encontrada.`);
      throw new NotFoundException('Cultura não encontrada.');
    }

    Object.assign(crop, dto);

    try {
      const updated = await this.cropRepository.save(crop);
      this.logger.log(`Cultura atualizada com sucesso: ID ${updated.id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Erro ao atualizar cultura ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar cultura.');
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo cultura ID ${id}`);

    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      this.logger.error(`Cultura com ID ${id} não encontrada.`);
      throw new NotFoundException('Cultura não encontrada.');
    }

    try {
      await this.cropRepository.remove(crop);
      this.logger.log(`Cultura removida com sucesso: ID ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover cultura ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao remover cultura.');
    }
  }
}
