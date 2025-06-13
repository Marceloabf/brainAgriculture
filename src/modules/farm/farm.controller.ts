import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmService } from './farm.service';

@ApiTags('farms')
@Controller('farms')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class FarmController {
  private readonly logger = new Logger(FarmController.name);
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'A soma das áreas agrícola e de vegetação não pode ser maior que a área total.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return await this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as Fazendas' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<Farm[]> {
    return await this.farmService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Farm> {
    return await this.farmService.findOne(id);
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
    return await this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao remover a fazenda.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.farmService.remove(id);
  }
}
