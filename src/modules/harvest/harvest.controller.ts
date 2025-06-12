import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova Safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createHarvestDto: CreateHarvestDto) {
    return await this.harvestService.create(createHarvestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as Safras' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    return await this.harvestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.harvestService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ) {
    return await this.harvestService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma Safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.harvestService.remove(id);
  }
}
