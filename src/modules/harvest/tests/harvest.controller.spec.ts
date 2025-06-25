import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from '../harvest.controller';
import { HarvestService } from '../harvest.service';
import { createHarvest } from '../../../../test/e2e/factories/harvest.factory';
import { faker } from '@faker-js/faker';

describe('HarvestController', () => {
  let controller: HarvestController;
  let service: HarvestService;

  const mockHarvestService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [
        {
          provide: HarvestService,
          useValue: mockHarvestService,
        },
      ],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<HarvestService>(HarvestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a harvest and return it', async () => {
      const dto = {
        name: faker.commerce.productName(),
        farmId: faker.string.uuid(),
        crops: [faker.string.uuid(), faker.string.uuid()],
      };

      const createdHarvest = createHarvest({
        id: faker.string.uuid(),
        name: dto.name,
        crops: [],
      });

      mockHarvestService.create.mockResolvedValue(createdHarvest);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdHarvest);
    });
  });

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const harvests = [createHarvest(), createHarvest()];
      mockHarvestService.findAll.mockResolvedValue(harvests);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(harvests);
    });
  });

  describe('findOne', () => {
    it('should return a single harvest by id', async () => {
      const harvest = createHarvest();
      mockHarvestService.findOne.mockResolvedValue(harvest);

      const result = await controller.findOne(harvest.id);

      expect(service.findOne).toHaveBeenCalledWith(harvest.id);
      expect(result).toEqual(harvest);
    });
  });

  describe('update', () => {
    it('should update and return the updated harvest', async () => {
      const id = faker.string.uuid();
      const updateDto = {
        name: faker.commerce.productName(),
        farmId: faker.string.uuid(),
        crops: [faker.string.uuid()],
      };

      const updatedHarvest = createHarvest({
        id,
        name: updateDto.name,
        crops: [],
      });

      mockHarvestService.update.mockResolvedValue(updatedHarvest);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedHarvest);
    });
  });

  describe('remove', () => {
    it('should remove the harvest and return undefined (204)', async () => {
      const id = faker.string.uuid();
      mockHarvestService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
