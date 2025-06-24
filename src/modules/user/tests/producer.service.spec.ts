import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NotFoundException } from "@nestjs/common"
import { ProducerService } from "../producer.service"
import { Producer } from "../entities/user.entity"
import type { CreateProducerDto } from "../dto/create-user.dto"
import type { UpdateProducerDto } from "../dto/update-user.dto"
import { jest } from "@jest/globals"

describe("ProducerService", () => {
  let service: ProducerService
  let producerRepository: any

  const mockProducer = {
    id: "uuid-producer-1",
    name: "João Silva",
    document: "12345678901",
    farms: [
      {
        id: "uuid-farm-1",
        name: "Fazenda Primavera",
        city: "Uberlândia",
        state: "MG",
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producer: {},
        harvests: [],
      },
    ],
  }

  beforeEach(async () => {
    const mockProducerRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      preload: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile()

    service = module.get<ProducerService>(ProducerService)
    producerRepository = module.get(getRepositoryToken(Producer))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a producer", async () => {
      const createProducerDto: CreateProducerDto = {
        name: "João Silva",
        document: "12345678901",
      }

      producerRepository.create.mockReturnValue(mockProducer)
      producerRepository.save.mockResolvedValue(mockProducer)

      const result = await service.create(createProducerDto)

      expect(result).toEqual(mockProducer)
      expect(producerRepository.create).toHaveBeenCalledWith(createProducerDto)
      expect(producerRepository.save).toHaveBeenCalledWith(mockProducer)
    })
  })

  describe("findAll", () => {
    it("should return all producers", async () => {
      const producers = [mockProducer]
      producerRepository.find.mockResolvedValue(producers)

      const result = await service.findAll()

      expect(result).toEqual(producers)
      expect(producerRepository.find).toHaveBeenCalledWith({
        relations: ["farms"],
      })
    })
  })

  describe("findOne", () => {
    it("should return a single producer by id", async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer)

      const result = await service.findOne("uuid-producer-1")

      expect(result).toEqual(mockProducer)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-producer-1" },
        relations: ["farms"],
      })
    })

    it("should throw NotFoundException if producer not found", async () => {
      producerRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a producer", async () => {
      const updateProducerDto: UpdateProducerDto = { name: "João Silva Atualizado" }
      const updatedProducer = { ...mockProducer, ...updateProducerDto }

      producerRepository.findOne.mockResolvedValue(mockProducer)
      producerRepository.save.mockResolvedValue(updatedProducer)

      const result = await service.update("uuid-producer-1", updateProducerDto)

      expect(result).toEqual(updatedProducer)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-producer-1" },
        relations: ["farms"],
      })
      expect(producerRepository.save).toHaveBeenCalledWith(updatedProducer)
    })

    it("should throw NotFoundException if producer to update not found", async () => {
      producerRepository.findOne.mockResolvedValue(null)

      await expect(service.update("invalid-id", {})).rejects.toThrow(NotFoundException)
    })
  })

  describe("remove", () => {
    it("should remove a producer", async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer)
      producerRepository.remove.mockResolvedValue(mockProducer)

      const result = await service.remove("uuid-producer-1")

      expect(result).toBeUndefined()
      expect(producerRepository.remove).toHaveBeenCalledWith(mockProducer)
    })

    it("should throw NotFoundException if producer to delete not found", async () => {
      producerRepository.findOne.mockResolvedValue(null)

      await expect(service.remove("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })
})
