import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from '../farm.controller';
import { FarmService } from '../farm.service';
import { createFarm, createProducer } from './factories/farm.factory';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  const mockFarm = createFarm();
  const mockProducer = createProducer();

  const mockFarmService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: mockFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm and return it', async () => {
      const createFarmDto = {
        name: mockFarm.name,
        city: mockFarm.city,
        state: mockFarm.state,
        totalArea: mockFarm.totalArea,
        agriculturalArea: mockFarm.agriculturalArea,
        vegetationArea: mockFarm.vegetationArea,
        producerId: mockProducer.id,
      };

      mockFarmService.create.mockResolvedValue(mockFarm);

      const result = await controller.create(createFarmDto);

      expect(service.create).toHaveBeenCalledWith(createFarmDto);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('findAll', () => {
    it('should return an array of farms', async () => {
      const farms = [mockFarm];
      mockFarmService.findAll.mockResolvedValue(farms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(farms);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      mockFarmService.findOne.mockResolvedValue(mockFarm);

      const result = await controller.findOne(mockFarm.id);

      expect(service.findOne).toHaveBeenCalledWith(mockFarm.id);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('update', () => {
    it('should update and return the updated farm', async () => {
      const updateFarmDto = {
        name: 'Fazenda Atualizada',
        totalArea: 300,
        agriculturalArea: 150,
        vegetationArea: 100,
      };

      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.update(mockFarm.id, updateFarmDto);

      expect(service.update).toHaveBeenCalledWith(mockFarm.id, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      mockFarmService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockFarm.id);

      expect(service.remove).toHaveBeenCalledWith(mockFarm.id);
      expect(result).toBeUndefined();
    });
  });
});
