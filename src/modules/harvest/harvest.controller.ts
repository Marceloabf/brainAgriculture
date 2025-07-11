import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestService } from './harvest.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
@ApiBearerAuth() 
@ApiTags('harvests')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova Safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiResponse({ status: 409, description: 'Já existe uma safra com esse nome para esta fazenda.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createHarvestDto: CreateHarvestDto) {
    return await this.harvestService.create(createHarvestDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todas as Safras' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.harvestService.findAll(paginationQuery);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.FUNCIONARIO)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.harvestService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada. || Nova fazenda associada não foi encontrada.' })
  @ApiResponse({ status: 409, description: 'Já existe uma safra com esse nome para esta fazenda.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ) {
    return await this.harvestService.update(id, updateHarvestDto);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.harvestService.remove(id);
  }
}
