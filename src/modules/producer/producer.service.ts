import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name)
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateProducerDto): Promise<Producer> {
    const existingProducer = await this.producerRepository.findOne({
      where: { document: dto.document },
    });

    if (existingProducer) {
      this.logger.error(
        `Produtor com documento ${dto.document} já existe.`,
      );
      throw new ConflictException(
        'Já existe um produtor com esse documento (CPF ou CNPJ).',
      );
    }

    const producer = this.producerRepository.create(dto);
    return this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find({ relations: ['farms'] });
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms'],
    });

    if (!producer) {
      this.logger.error(`Produtor com ID ${id} não encontrado.`);
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findOne(id);
    Object.assign(producer, dto);
    return this.producerRepository.save(producer);
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id);
    await this.producerRepository.remove(producer);
  }
}
