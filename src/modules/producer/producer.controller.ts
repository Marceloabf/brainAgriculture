import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerService } from './producer.service';

@ApiTags('producers')
@Controller('producers')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Post()
  @ApiOperation({ summary: 'Cadastrar novo Produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Já existe um produtor com esse documento (CPF ou CNPJ).' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() dto: CreateProducerDto) {
    return await this.producerService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todos os Produtores' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    return await this.producerService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string) {
   return await this.producerService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return await this.producerService.update(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um Produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.producerService.remove(id);
  }
}
