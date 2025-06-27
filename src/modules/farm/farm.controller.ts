import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmService } from './farm.service';
import { PaginationResult } from 'src/common/dto/pagination-result.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth() 
@ApiTags('farms')
@Controller('farms')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class FarmController {
  private readonly logger = new Logger(FarmController.name);
  constructor(private readonly farmService: FarmService) {}

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova Fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'A soma das áreas agrícola e de vegetação não pode ser maior que a área total.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return await this.farmService.create(createFarmDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todas as Fazendas' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginationResult<Farm>> {
    return await this.farmService.findAll(paginationQuery);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.FUNCIONARIO)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Farm> {
    return await this.farmService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
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

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao remover a fazenda.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.farmService.remove(id);
  }
}
