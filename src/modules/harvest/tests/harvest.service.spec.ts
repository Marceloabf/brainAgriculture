import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from '../harvest.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Harvest } from '../entities/harvest.entity';
import { Farm } from '../../farm/entities/farm.entity';
import { Repository } from 'typeorm';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { NotFoundException } from '@nestjs/common';

const mockHarvestRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

const mockFarmRepository = () => ({
  findOne: jest.fn(),
});

describe('HarvestService', () => {
  let service: HarvestService;
  let harvestRepository: jest.Mocked<Repository<Harvest>>;
  let farmRepository: jest.Mocked<Repository<Farm>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: getRepositoryToken(Harvest),
          useFactory: mockHarvestRepository,
        },
        {
          provide: getRepositoryToken(Farm),
          useFactory: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    harvestRepository = module.get(getRepositoryToken(Harvest));
    farmRepository = module.get(getRepositoryToken(Farm));
  });

  const mockFarm = { id: 'uuid-farm-id' } as Farm;
  const mockHarvest = { id: 'uuid-harvest-id', name: 'Harvest 1', farm: mockFarm } as Harvest;

  describe('create', () => {
    it('should create a new harvest', async () => {
      const dto: CreateHarvestDto = { name: 'Harvest 1', farmId: mockFarm.id, crops: [] };

      farmRepository.findOne.mockResolvedValue(mockFarm);
      harvestRepository.create.mockReturnValue(mockHarvest);
      harvestRepository.save.mockResolvedValue(mockHarvest);

      const result = await service.create(dto);
      expect(result).toEqual(mockHarvest);
      expect(harvestRepository.save).toHaveBeenCalledWith(mockHarvest);
    });

    it('should throw NotFoundException if farm not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);
      const dto: CreateHarvestDto = { name: 'Invalid', farmId: 'invalid-id', crops: [] };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all harvests', async () => {
      harvestRepository.find.mockResolvedValue([mockHarvest]);
      const result = await service.findAll();
      expect(result).toEqual([mockHarvest]);
    });
  });

  describe('findOne', () => {
    it('should return a harvest by id', async () => {
      harvestRepository.findOne.mockResolvedValue(mockHarvest);
      const result = await service.findOne('uuid-harvest-id');
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      harvestRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a harvest', async () => {
      const dto: UpdateHarvestDto = { name: 'Updated Name' };
      harvestRepository.preload.mockResolvedValue(mockHarvest);
      harvestRepository.save.mockResolvedValue(mockHarvest);

      const result = await service.update('uuid-harvest-id', dto);
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException if harvest to update not found', async () => {
      harvestRepository.preload.mockResolvedValue(undefined);
      await expect(service.update('invalid-id', { name: 'test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a harvest', async () => {
      harvestRepository.findOne.mockResolvedValue(mockHarvest);
      harvestRepository.remove.mockResolvedValue(mockHarvest);
      const result = await service.remove('uuid-harvest-id');
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException if harvest to delete not found', async () => {
      harvestRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
