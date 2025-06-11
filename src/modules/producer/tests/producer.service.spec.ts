import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from '../producer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from '../entities/producer.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Farm } from 'src/modules/farm/entities/farm.entity';

describe('ProducerService', () => {
  let service: ProducerService;
  let producerRepository: jest.Mocked<Repository<Producer>>;

  const mockFarm: Farm = {
    id: 'uuid-farm-1',
    name: 'Fazenda Primavera',
    city: 'Uberlândia',
    state: 'MG',
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 40,
    producer: {} as Producer,
    harvests: [],
  };

  const mockProducer: Producer = {
    id: 'uuid-producer-1',
    name: 'João Silva',
    document: '12345678901',
    farms: [mockFarm],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    producerRepository = module.get(getRepositoryToken(Producer));
  });

  it('should create a producer', async () => {
    const dto: CreateProducerDto = {
      name: 'João Silva',
      document: '12345678901',
    };
    producerRepository.create.mockReturnValue(mockProducer);
    producerRepository.save.mockResolvedValue(mockProducer);

    const result = await service.create(dto);
    expect(result).toEqual(mockProducer);
    expect(producerRepository.create).toHaveBeenCalledWith(dto);
    expect(producerRepository.save).toHaveBeenCalledWith(mockProducer);
  });

  it('should return all producers', async () => {
    producerRepository.find.mockResolvedValue([mockProducer]);

    const result = await service.findAll();
    expect(result).toEqual([mockProducer]);
  });

  it('should return one producer by ID', async () => {
    producerRepository.findOne.mockResolvedValue(mockProducer);

    const result = await service.findOne('uuid-1234');
    expect(result).toEqual(mockProducer);
  });

  it('should throw NotFoundException if producer not found', async () => {
    producerRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a producer', async () => {
    const dto: UpdateProducerDto = { name: 'Novo Nome' };

    producerRepository.preload.mockResolvedValue({
      ...mockProducer,
      ...dto,
      farms: mockProducer.farms,
    });
    producerRepository.save.mockResolvedValue({
      ...mockProducer,
      ...dto,
      farms: mockProducer.farms,
    });

    const result = await service.update('uuid-1234', dto);
    expect(result).toEqual({ ...mockProducer, ...dto });
  });

  it('should throw NotFoundException if producer to update not found', async () => {
    producerRepository.preload.mockResolvedValue(undefined);

    await expect(service.update('invalid-id', { name: 'x' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a producer', async () => {
    producerRepository.findOne.mockResolvedValue(mockProducer);
    producerRepository.remove.mockResolvedValue(mockProducer);

    const result = await service.remove('uuid-1234');
    expect(result).toEqual(mockProducer);
  });

  it('should throw NotFoundException if producer to delete not found', async () => {
    producerRepository.findOne.mockResolvedValue(null);

    await expect(service.remove('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
