import {
  Controller,
  NotFoundException,
  BadRequestException,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('crops')
@Controller('crops')
export class CropController {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Colheita' })
  @ApiResponse({ status: 201, description: 'Colheita criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createCropDto: CreateCropDto): Promise<Crop> {
    try {
      const crop = this.cropRepository.create(createCropDto);
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao criar a safra (crop).');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as Colheitas' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<Crop[]> {
    return await this.cropRepository.find({
      relations: ['harvest'],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Colheita por ID' })
  @ApiResponse({ status: 200, description: 'Colheita encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: ['harvest'],
    });

    if (!crop) {
      throw new NotFoundException(`Safra (crop) com id ${id} não encontrada.`);
    }

    return crop;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma Colheita por ID' })
  @ApiResponse({ status: 200, description: 'Colheita atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() updateCropDto: UpdateCropDto,
  ): Promise<Crop> {
    const crop = await this.findOne(id);

    Object.assign(crop, updateCropDto);

    try {
      return await this.cropRepository.save(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar a safra (crop).');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Colheita por ID' })
  @ApiResponse({ status: 200, description: 'Colheita removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  async remove(@Param('id') id: string): Promise<void> {
    const crop = await this.findOne(id);

    try {
      await this.cropRepository.remove(crop);
    } catch (error) {
      throw new BadRequestException('Erro ao deletar a safra (crop).');
    }
  }
}
