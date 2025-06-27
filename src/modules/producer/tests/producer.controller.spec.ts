import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from '../producer.controller';
import { ProducerService } from '../producer.service';
import { createProducer } from '../../../../test/e2e/factories/producer.factory'; 

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  const mockProducerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [{ provide: ProducerService, useValue: mockProducerService }],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer and return it', async () => {
      const { id, farms, ...dto } = createProducer();
      const createdProducer = { id, ...dto };

      mockProducerService.create.mockResolvedValue(createdProducer);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdProducer);
    });
  });

 describe('findAll', () => {
  it('should return paginated producers with metadata', async () => {
    const paginationQuery = { page: 1, limit: 10 };
    const producers = [createProducer(), createProducer()];
    const meta = {
      totalItems: producers.length,
      itemCount: producers.length,
      itemsPerPage: paginationQuery.limit,
      totalPages: 1,
      currentPage: paginationQuery.page,
    };

    const paginatedResult = { data: producers, meta };

    mockProducerService.findAll.mockResolvedValue(paginatedResult);

    const result = await controller.findAll(paginationQuery);

    expect(mockProducerService.findAll).toHaveBeenCalledWith(paginationQuery);
    expect(result).toEqual(paginatedResult);
  });
});


  describe('findOne', () => {
    it('should return a single producer by id', async () => {
      const producer = createProducer();

      mockProducerService.findOne.mockResolvedValue(producer);

      const result = await controller.findOne(producer.id);

      expect(service.findOne).toHaveBeenCalledWith(producer.id);
      expect(result).toEqual(producer);
    });
  });

  describe('update', () => {
    it('should update and return the updated producer', async () => {
      const producer = createProducer();
      const updateDto = { name: 'Novo Nome' };
      const updatedProducer = { ...producer, name: updateDto.name };

      mockProducerService.update.mockResolvedValue(updatedProducer);

      const result = await controller.update(producer.id, updateDto);

      expect(service.update).toHaveBeenCalledWith(producer.id, updateDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('remove', () => {
    it('should remove the producer and return undefined', async () => {
      const producer = createProducer();
      mockProducerService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(producer.id);

      expect(service.remove).toHaveBeenCalledWith(producer.id);
      expect(result).toBeUndefined();
    });
  });
});
