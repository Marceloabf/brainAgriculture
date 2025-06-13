import {
  Controller,
  NotFoundException,
  BadRequestException,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('farms')
@Controller('farms')
export class FarmController {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'A soma das áreas agrícola e de vegetação não pode ser maior que a área total.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    try {
      const farm = this.farmRepository.create(createFarmDto);
      return await this.farmRepository.save(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao criar a fazenda.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as Fazendas' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<Farm[]> {
    return await this.farmRepository.find({
      relations: ['producer', 'harvests'],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'harvests'],
    });

    if (!farm) {
      throw new NotFoundException(`Fazenda com id ${id} não encontrada.`);
    }

    return farm;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada. || Produtor não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar a fazenda.' })
  async update(
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    const farm = await this.findOne(id);

    Object.assign(farm, updateFarmDto);

    try {
      return await this.farmRepository.save(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar a fazenda.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao remover a fazenda.' })
  async remove(@Param('id') id: string): Promise<void> {
    const farm = await this.findOne(id);
    try {
      await this.farmRepository.remove(farm);
    } catch (error) {
      throw new BadRequestException('Erro ao deletar a fazenda.');
    }
  }
}
