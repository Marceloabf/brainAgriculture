import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CropService } from './crop.service';

@ApiTags('crops')
@Controller('crops')
export class CropController {
  constructor(
    private readonly cropService: CropService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 500, description: 'Erro ao salvar cultura.' })
  async create(@Body() createCropDto: CreateCropDto): Promise<Crop> {
    return await this.cropService.create(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as Culturas' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar as culturas.' })
  async findAll(): Promise<Crop[]> {
    return await this.cropService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Crop> {
    return await this.cropService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma Cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar a cultura.'})
  async update(
    @Param('id') id: string,
    @Body() updateCropDto: UpdateCropDto,
  ): Promise<Crop> {
    return await this.cropService.update(id, updateCropDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.'})
  @ApiResponse({ status: 500, description: 'Erro ao remover cultura.' })
  async remove(@Param('id') id: string): Promise<void> {
   return await this.cropService.remove(id);
  }
}
