import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
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
   this.logger.log(`Tentativa de criar safra: ${JSON.stringify(dto)}`);

    const farm = await this.farmRepository.findOne({ where: { id: dto.farmId } });
    if (!farm) {
      this.logger.error(`Fazenda com ID ${dto.farmId} não encontrada.`);
      throw new NotFoundException('Fazenda não encontrada.');
    }

    const existing = await this.harvestRepository.findOne({
      where: { name: dto.name, farm: { id: dto.farmId } },
    });
    if (existing) {
      this.logger.error(`Já existe uma safra com o nome "${dto.name}" para a fazenda ID ${dto.farmId}.`);
      throw new ConflictException('Já existe uma safra com esse nome para esta fazenda.');
    }

    let crops: Crop[] = [];
    if (dto.crops && dto.crops.length > 0) {
      crops = await this.cropRepository.findByIds(dto.crops);
      if (crops.length !== dto.crops.length) {
        this.logger.error('Alguma(s) cultura(s) informada(s) não foram encontradas.');
        throw new BadRequestException('Alguma(s) culturas informada(s) não foram encontradas.');
      }
    }

    const harvest = this.harvestRepository.create({
      name: dto.name,
      farm,
      crops,
    });

    try {
      const saved = await this.harvestRepository.save(harvest);
      this.logger.log(`Safra criada com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Erro ao salvar a safra.', error.stack);
      throw new InternalServerErrorException('Erro ao salvar a safra.');
    }
}

  async findAll(): Promise<Harvest[]> {
    this.logger.log('Buscando todas as safras');

    try {
      const harvests = await this.harvestRepository.find({ relations: ['crops', 'farm'] });
      this.logger.log(`Retornadas ${harvests.length} safras`);
      return harvests;
    } catch (error) {
      this.logger.error('Erro ao buscar as safras.', error.stack);
      throw new InternalServerErrorException('Erro ao buscar as safras.');
    }
  }

  async findOne(id: string): Promise<Harvest> {
    this.logger.log(`Buscando safra com ID: ${id}`);

    try {
      const harvest = await this.harvestRepository.findOne({
        where: { id },
        relations: ['crops', 'farm'],
      });

      if (!harvest) {
        this.logger.error(`Safra com ID ${id} não encontrada.`);
        throw new NotFoundException('Safra não encontrada.');
      }

      this.logger.log(`Safra encontrada: ID ${harvest.id}`);
      return harvest;
    } catch (error) {
      this.logger.error(`Erro ao buscar safra ID ${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar a safra.');
    }
  }

async update(id: string, dto: UpdateHarvestDto): Promise<Harvest> {
  this.logger.log(`Atualizando safra ID ${id} com dados: ${JSON.stringify(dto)}`);

    const harvest = await this.harvestRepository.findOne({
      where: { id },
      relations: ['farm', 'crops'],
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
        where: { name: dto.name, farm: { id: farmId } },
      });

      if (conflict && conflict.id !== id) {
        this.logger.error(`Já existe uma safra com o nome "${dto.name}" para a fazenda ID ${farmId}.`);
        throw new ConflictException('Já existe uma safra com esse nome para esta fazenda.');
      }

      harvest.name = dto.name;
    }

    if (dto.crops) {
      const crops = await this.cropRepository.findByIds(dto.crops);
      if (crops.length !== dto.crops.length) {
        this.logger.error('Alguma(s) cultura(s) informada(s) não foram encontradas.');
        throw new BadRequestException('Alguma(s) culturas informada(s) não foram encontradas.');
      }
      harvest.crops = crops;
    }

    try {
      const saved = await this.harvestRepository.save(harvest);
      this.logger.log(`Safra atualizada com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Erro ao salvar a safra atualizada ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar a safra.');
    }
}

  async remove(id: string): Promise<void> {
   this.logger.log(`Removendo safra ID ${id}`);

    const harvest = await this.harvestRepository.findOneBy({ id });
    if (!harvest) {
      this.logger.error(`Safra com ID ${id} não encontrada.`);
      throw new NotFoundException('Safra não encontrada.');
    }

    try {
      await this.harvestRepository.remove(harvest);
      this.logger.log(`Safra removida com sucesso: ID ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover safra ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao remover a safra.');
    }
  }
}
