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
  it('should return paginated crops with metadata', async () => {
    const paginationQuery = { page: 1, limit: 10 };

    const mockPaginationResult = {
      data: [mockCrop],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    mockCropService.findAll.mockResolvedValue(mockPaginationResult);

    const result = await controller.findAll(paginationQuery);

    expect(service.findAll).toHaveBeenCalledWith(paginationQuery);
    expect(result).toEqual(mockPaginationResult);
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
