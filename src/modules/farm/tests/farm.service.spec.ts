import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FarmService } from '../farm.service';
import { Farm } from '../entities/farm.entity';
import { Producer } from 'src/modules/producer/entities/producer.entity';
import { faker } from '@faker-js/faker';
import type { CreateFarmDto } from '../dto/create-farm.dto';
import type { UpdateFarmDto } from '../dto/update-farm.dto';
import { createFarm, createProducer } from './factories/farm.factory';

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: any;
  let producerRepository: any;

  const mockFarm = createFarm();
  const mockProducer = createProducer();

  beforeEach(async () => {
    const mockFarmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      preload: jest.fn(),
    };

    const mockProducerRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    farmRepository = module.get(getRepositoryToken(Farm));
    producerRepository = module.get(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm', async () => {
      const createFarmDto: CreateFarmDto = {
        name: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        totalArea: 200,
        agriculturalArea: 120,
        vegetationArea: 80,
        producerId: mockProducer.id,
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(createFarmDto);

      expect(result).toEqual(mockFarm);
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFarmDto.producerId },
      });
      expect(farmRepository.create).toHaveBeenCalledWith({
        name: createFarmDto.name,
        city: createFarmDto.city,
        state: createFarmDto.state,
        totalArea: createFarmDto.totalArea,
        agriculturalArea: createFarmDto.agriculturalArea,
        vegetationArea: createFarmDto.vegetationArea,
        producer: mockProducer,
      });
      expect(farmRepository.save).toHaveBeenCalledWith(mockFarm);
    });

    it('should throw BadRequestException if agriculturalArea + vegetationArea > totalArea', async () => {
    const invalidCreateDto: CreateFarmDto = {
      name: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      totalArea: 100,
      agriculturalArea: 70,
      vegetationArea: 40, 
      producerId: mockProducer.id,
    };

    producerRepository.findOne.mockResolvedValue(mockProducer);

    await expect(service.create(invalidCreateDto)).rejects.toThrow('A soma das áreas agrícola e de vegetação não pode ser maior que a área total.');
  });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [mockFarm];
      farmRepository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(result).toEqual(farms);
      expect(farmRepository.find).toHaveBeenCalledWith({
        relations: ['producer', 'harvests'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single farm by id', async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne(mockFarm.id);

      expect(result).toEqual(mockFarm);
      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
        relations: ['producer', 'harvests'],
      });
    });

    it('should throw NotFoundException if farm not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a farm', async () => {
      const updateFarmDto: UpdateFarmDto = {
        name: 'Fazenda Atualizada',
      };

      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      farmRepository.findOne.mockResolvedValue(mockFarm);
      farmRepository.preload.mockResolvedValue(updatedFarm);
      farmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(result).toEqual(updatedFarm);
      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
      });
      expect(farmRepository.save).toHaveBeenCalledWith(updatedFarm);
    });

    it('should throw NotFoundException if farm to update not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if agriculturalArea + vegetationArea > totalArea on update', async () => {
    const invalidUpdateDto: UpdateFarmDto = {
      totalArea: 100,
      agriculturalArea: 70,
      vegetationArea: 40, // 110 > 100 inválido
    };

    farmRepository.findOne.mockResolvedValue(mockFarm);

    await expect(service.update(mockFarm.id, invalidUpdateDto)).rejects.toThrow('A soma da área agricultável e da área de vegetação não pode ser maior que a área total.');
  });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm);
      farmRepository.remove.mockResolvedValue(mockFarm);

      const result = await service.remove(mockFarm.id);

      expect(result).toBeUndefined();
      expect(farmRepository.remove).toHaveBeenCalledWith(mockFarm);
    });

    it('should throw NotFoundException if farm to delete not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
