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

@Controller('producers')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async create(@Body() dto: CreateProducerDto) {
    const producer = await this.producerService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Produtor criado com sucesso.',
      data: producer,
    };
  }

  @Get()
  async findAll() {
    const producers = await this.producerService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: producers,
    };
  }

  @Get(':id')
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
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    const updated = await this.producerService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Produtor atualizado com sucesso.',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.producerService.remove(id);
  }
}
