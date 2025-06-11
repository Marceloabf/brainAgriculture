import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from '../farm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from '../entities/farm.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';

const mockFarm = {
  id: 'uuid-farm-1',
  name: 'Fazenda Primavera',
  city: 'Uberlândia',
  state: 'MG',
  totalArea: 100,
  agriculturalArea: 60,
  vegetationArea: 40,
  producer: {
    id: 'uuid-producer-1',
    name: 'Produtor X',
    document: '12345678901',
    farms: [],
  },
  harvests: [],
};

const mockFarmArray = [mockFarm];

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: jest.Mocked<Repository<Farm>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
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

    service = module.get<FarmService>(FarmService);
    farmRepository = module.get(getRepositoryToken(Farm));
  });

  it('should create a farm', async () => {
    const dto: CreateFarmDto = {
      name: 'Fazenda Primavera',
      city: 'Uberlândia',
      state: 'MG',
      totalArea: 100,
      agriculturalArea: 60,
      vegetationArea: 40,
      producerId: 'uuid-producer-1',
    };

    farmRepository.create.mockReturnValue(mockFarm);
    farmRepository.save.mockResolvedValue(mockFarm);

    const result = await service.create(dto);
    expect(result).toEqual(mockFarm);
    expect(farmRepository.create).toHaveBeenCalledWith({
      ...dto,
      producer: { id: dto.producerId },
    });
    expect(farmRepository.save).toHaveBeenCalledWith(mockFarm);
  });

  it('should return all farms', async () => {
    farmRepository.find.mockResolvedValue(mockFarmArray);
    const result = await service.findAll();
    expect(result).toEqual(mockFarmArray);
  });

  it('should return a single farm by id', async () => {
    farmRepository.findOne.mockResolvedValue(mockFarm);
    const result = await service.findOne('uuid-farm-1');
    expect(result).toEqual(mockFarm);
  });

  it('should throw NotFoundException if farm not found', async () => {
    farmRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a farm', async () => {
    const updateDto: UpdateFarmDto = { name: 'Nova Fazenda' };
    const updatedFarm = { ...mockFarm, ...updateDto };

    farmRepository.preload.mockResolvedValue(updatedFarm);
    farmRepository.save.mockResolvedValue(updatedFarm);

    const result = await service.update('uuid-farm-1', updateDto);
    expect(result).toEqual(updatedFarm);
  });

  it('should throw NotFoundException if farm to update not found', async () => {
    farmRepository.findOne.mockResolvedValue(null);
    await expect(
      service.update('invalid-id', {} as UpdateFarmDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a farm', async () => {
    farmRepository.findOne.mockResolvedValue(mockFarm);
    farmRepository.remove.mockResolvedValue(mockFarm);

    const result = await service.remove('uuid-farm-1');
    expect(result).toEqual(mockFarm);
  });

  it('should throw NotFoundException if farm to delete not found', async () => {
    farmRepository.findOne.mockResolvedValue(null);
    await expect(service.remove('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
