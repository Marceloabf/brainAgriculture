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
    const producer = await this.producerService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Produtor criado com sucesso.',
      data: producer,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Produtores' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    const producers = await this.producerService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: producers,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string) {
    const producer = await this.producerService.findOne(id);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado.');
    }
    return {
      statusCode: HttpStatus.OK,
      data: producer,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    const updated = await this.producerService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Produtor atualizado com sucesso.',
      data: updated,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.producerService.remove(id);
  }
}
