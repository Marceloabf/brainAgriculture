import { Test, TestingModule } from '@nestjs/testing';
import { CropController } from '../crop.controller';
import { CropService } from '../crop.service';
import { createCrop } from '../../../../test/e2e/factories/crop.factory';

describe('CropController', () => {
  let controller: CropController;
  let service: CropService;

  const mockCrop = createCrop();

  const mockCropService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: CropService,
          useValue: mockCropService,
        },
      ],
    }).compile();

    controller = module.get<CropController>(CropController);
    service = module.get<CropService>(CropService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop and return it', async () => {
      const createCropDto = { name: mockCrop.name };

      mockCropService.create.mockResolvedValue(mockCrop);

      const result = await controller.create(createCropDto);

      expect(service.create).toHaveBeenCalledWith(createCropDto);
      expect(result).toEqual(mockCrop);
    });
  });

  describe('findAll', () => {
    it('should return an array of crops', async () => {
      const crops = [mockCrop];
      mockCropService.findAll.mockResolvedValue(crops);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(crops);
    });
  });

  describe('findOne', () => {
    it('should return a single crop by id', async () => {
      mockCropService.findOne.mockResolvedValue(mockCrop);

      const result = await controller.findOne(mockCrop.id);

      expect(service.findOne).toHaveBeenCalledWith(mockCrop.id);
      expect(result).toEqual(mockCrop);
    });
  });

  describe('update', () => {
    it('should update and return the updated crop', async () => {
      const updateCropDto = { name: 'Updated Crop Name' };
      const updatedCrop = { ...mockCrop, ...updateCropDto };

      mockCropService.update.mockResolvedValue(updatedCrop);

      const result = await controller.update(mockCrop.id, updateCropDto);

      expect(service.update).toHaveBeenCalledWith(mockCrop.id, updateCropDto);
      expect(result).toEqual(updatedCrop);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      mockCropService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockCrop.id);

      expect(service.remove).toHaveBeenCalledWith(mockCrop.id);
      expect(result).toBeUndefined();
    });
  });
});
