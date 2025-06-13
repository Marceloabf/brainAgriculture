import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('producers')
@Controller('producers')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo Produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Já existe um produtor com esse documento (CPF ou CNPJ).' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() dto: CreateProducerDto) {
    return await this.producerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Produtores' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    return await this.producerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string) {
   return await this.producerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return await this.producerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.producerService.remove(id);
  }
}
