import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
     this.logger.log(`Tentativa de criar produtor: ${JSON.stringify(dto)}`);

    const existingProducer = await this.producerRepository.findOne({
      where: { document: dto.document },
    });

    if (existingProducer) {
      this.logger.error(`Produtor com documento ${dto.document} já existe.`);
      throw new ConflictException(
        'Já existe um produtor com esse documento (CPF ou CNPJ).',
      );
    }

    const producer = this.producerRepository.create(dto);

    try {
      const saved = await this.producerRepository.save(producer);
      this.logger.log(`Produtor criado com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Erro ao salvar produtor.', error.stack);
      throw new InternalServerErrorException('Erro ao salvar produtor.');
    }
  }

  async findAll(): Promise<Producer[]> {
   this.logger.log('Buscando todos os produtores');

    try {
      const producers = await this.producerRepository.find({ relations: ['farms'] });
      this.logger.log(`Retornados ${producers.length} produtores`);
      return producers;
    } catch (error) {
      this.logger.error('Erro ao buscar produtores.', error.stack);
      throw new InternalServerErrorException('Erro ao buscar produtores.');
    }
  }

  async findOne(id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`);

    try {
      const producer = await this.producerRepository.findOne({
        where: { id },
        relations: ['farms'],
      });

      if (!producer) {
        this.logger.error(`Produtor com ID ${id} não encontrado.`);
        throw new NotFoundException('Produtor não encontrado');
      }

      this.logger.log(`Produtor encontrado: ID ${producer.id}`);
      return producer;
    } catch (error) {
      this.logger.error(`Erro ao buscar produtor ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Erro ao buscar produtor.');
    }
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    this.logger.log(`Atualizando produtor ID ${id} com dados: ${JSON.stringify(dto)}`);

    const producer = await this.findOne(id);
    Object.assign(producer, dto);

    try {
      const saved = await this.producerRepository.save(producer);
      this.logger.log(`Produtor atualizado com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Erro ao atualizar produtor ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar produtor.');
    }
  }

  async remove(id: string): Promise<void> {
     this.logger.log(`Removendo produtor ID ${id}`);

    const producer = await this.findOne(id);

    try {
      await this.producerRepository.remove(producer);
      this.logger.log(`Produtor removido com sucesso: ID ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover produtor ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao remover produtor.');
    }
  }
}
