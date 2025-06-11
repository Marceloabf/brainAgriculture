import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from '../crop.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Crop } from '../entities/crop.entity';
import { Harvest } from '../../harvest/entities/harvest.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockCropRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

const mockHarvestRepository = () => ({
  findOne: jest.fn(),
});

describe('CropService', () => {
  let service: CropService;
  let cropRepository: jest.Mocked<Repository<Crop>>;
  let harvestRepository: jest.Mocked<Repository<Harvest>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: getRepositoryToken(Crop),
          useFactory: mockCropRepository,
        },
        {
          provide: getRepositoryToken(Harvest),
          useFactory: mockHarvestRepository,
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    cropRepository = module.get(getRepositoryToken(Crop));
    harvestRepository = module.get(getRepositoryToken(Harvest));
  });

const mockHarvest = {
  id: 'uuid-harvest-1',
  name: 'Safra Verão',
  crops: [],
  farm: {
    id: 'uuid-farm-1',
    name: 'Fazenda Primavera',
    city: 'Uberlândia',
    state: 'MG',
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 40,
    producer: {
      id: 'uuid-producer-1',
      name: 'João da Silva',
      document: '123.456.789-00',
      farms: [],
    },
    harvests: [],
  },
} as Harvest;

  const mockCrop = {
    id: 'uuid-crop-1',
    name: 'Milho',
    harvest: mockHarvest,
  } as Crop;

  describe('create', () => {
    it('should create and return a crop', async () => {
      const dto = { name: 'Milho', harvestId: mockHarvest.id };
      harvestRepository.findOne.mockResolvedValue(mockHarvest);
      cropRepository.create.mockReturnValue(mockCrop);
      cropRepository.save.mockResolvedValue(mockCrop);

      const result = await service.create(dto);

      expect(harvestRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.harvestId } });
      expect(result).toEqual(mockCrop);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      harvestRepository.findOne.mockResolvedValue(null);

      await expect(service.create({ name: 'Milho', harvestId: 'invalid-id' }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      cropRepository.find.mockResolvedValue([mockCrop]);

      const result = await service.findAll();

      expect(result).toEqual([mockCrop]);
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      cropRepository.findOne.mockResolvedValue(mockCrop);

      const result = await service.findOne(mockCrop.id);

      expect(result).toEqual(mockCrop);
    });

    it('should throw NotFoundException if crop not found', async () => {
      cropRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the crop', async () => {
      const updateDto = { name: 'Soja' };
      cropRepository.preload.mockResolvedValue({ ...mockCrop, ...updateDto });
      cropRepository.save.mockResolvedValue({ ...mockCrop, ...updateDto });

      const result = await service.update(mockCrop.id, updateDto);

      expect(result).toEqual({ ...mockCrop, ...updateDto });
    });

    it('should throw NotFoundException if crop to update not found', async () => {
      cropRepository.preload.mockResolvedValue(undefined);

      await expect(service.update('invalid-id', { name: 'Arroz' }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the crop and return it', async () => {
      cropRepository.findOne.mockResolvedValue(mockCrop);
      cropRepository.remove.mockResolvedValue(mockCrop);

      const result = await service.remove(mockCrop.id);

      expect(result).toEqual(mockCrop);
    });

    it('should throw NotFoundException if crop to remove not found', async () => {
      cropRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
