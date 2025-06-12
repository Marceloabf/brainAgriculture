import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NotFoundException } from "@nestjs/common"
import { FarmService } from "../farm.service"
import { Farm } from "../entities/farm.entity"
import { Producer } from "src/modules/producer/entities/producer.entity"
import type { CreateFarmDto } from "../dto/create-farm.dto"
import type { UpdateFarmDto } from "../dto/update-farm.dto"
import { jest } from "@jest/globals" 

describe("FarmService", () => {
  let service: FarmService
  let farmRepository: any
  let producerRepository: any

  const mockFarm = {
    id: "uuid-farm-1",
    name: "Fazenda Primavera",
    city: "Uberlândia",
    state: "MG",
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 40,
    producer: {
      id: "uuid-producer-1",
      name: "João Silva",
      document: "12345678901",
    },
    harvests: [],
  }

  const mockProducer = {
    id: "uuid-producer-1",
    name: "João Silva",
    document: "12345678901",
    farms: [],
  }

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
    }

    const mockProducerRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    }

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
    }).compile()

    service = module.get<FarmService>(FarmService)
    farmRepository = module.get(getRepositoryToken(Farm))
    producerRepository = module.get(getRepositoryToken(Producer))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a farm", async () => {
      const createFarmDto: CreateFarmDto = {
        name: "Fazenda Primavera",
        city: "Uberlândia",
        state: "MG",
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producerId: "uuid-producer-1",
      }

      producerRepository.findOne.mockResolvedValue(mockProducer)
      farmRepository.create.mockReturnValue(mockFarm)
      farmRepository.save.mockResolvedValue(mockFarm)

      const result = await service.create(createFarmDto)

      expect(result).toEqual(mockFarm)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-producer-1" },
      })
      expect(farmRepository.create).toHaveBeenCalledWith({
        name: "Fazenda Primavera",
        city: "Uberlândia",
        state: "MG",
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producer: mockProducer,
      })
      expect(farmRepository.save).toHaveBeenCalledWith(mockFarm)
    })
  })

  describe("findAll", () => {
    it("should return all farms", async () => {
      const farms = [mockFarm]
      farmRepository.find.mockResolvedValue(farms)

      const result = await service.findAll()

      expect(result).toEqual(farms)
      expect(farmRepository.find).toHaveBeenCalledWith({
        relations: ["producer", "harvests"],
      })
    })
  })

  describe("findOne", () => {
    it("should return a single farm by id", async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm)

      const result = await service.findOne("uuid-farm-1")

      expect(result).toEqual(mockFarm)
      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-farm-1" },
        relations: ["producer", "harvests"],
      })
    })

    it("should throw NotFoundException if farm not found", async () => {
      farmRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a farm", async () => {
      const updateFarmDto: UpdateFarmDto = { name: "Fazenda Atualizada" }
      const updatedFarm = { ...mockFarm, ...updateFarmDto }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      farmRepository.preload.mockResolvedValue(updatedFarm) 
      farmRepository.save.mockResolvedValue(updatedFarm)

      const result = await service.update("uuid-farm-1", updateFarmDto)

      expect(result).toEqual(updatedFarm)
      expect(farmRepository.findOne).toHaveBeenCalledWith({ where: { id: "uuid-farm-1" } })
      expect(farmRepository.save).toHaveBeenCalledWith(updatedFarm)
    })

    it("should throw NotFoundException if farm to update not found", async () => {
      farmRepository.findOne.mockResolvedValue(null)

      await expect(service.update("invalid-id", {})).rejects.toThrow(NotFoundException)
    })
  })

  describe("remove", () => {
    it("should remove a farm", async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm)
      farmRepository.remove.mockResolvedValue(mockFarm)

      const result = await service.remove("uuid-farm-1")

      expect(result).toBeUndefined()
      expect(farmRepository.remove).toHaveBeenCalledWith(mockFarm)
    })

    it("should throw NotFoundException if farm to delete not found", async () => {
      farmRepository.findOne.mockResolvedValue(null)

      await expect(service.remove("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })
})
