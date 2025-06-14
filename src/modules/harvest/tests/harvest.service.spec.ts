import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NotFoundException, ConflictException } from "@nestjs/common"
import { HarvestService } from "../harvest.service"
import { Harvest } from "../entities/harvest.entity"
import { Farm } from "src/modules/farm/entities/farm.entity"
import { Crop } from "src/modules/crop/entities/crop.entity"
import type { CreateHarvestDto } from "../dto/create-harvest.dto"
import type { UpdateHarvestDto } from "../dto/update-harvest.dto"
import { jest } from "@jest/globals"

describe("HarvestService", () => {
  let service: HarvestService
  let harvestRepository: any
  let farmRepository: any
  let cropRepository: any

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
      name: "João da Silva",
      document: "123.456.789-00",
    },
    harvests: [],
  }

  const mockHarvest = {
    id: "uuid-harvest-1",
    name: "Safra Verão",
    farm: mockFarm,
    crops: [],
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const mockHarvestRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findByIds: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      preload: jest.fn(),
    }

    const mockFarmRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    }

    const mockCropRepository = {
      find: jest.fn(),
      findBy: jest.fn(),
      findByIds: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: getRepositoryToken(Harvest),
          useValue: mockHarvestRepository,
        },
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
      ],
    }).compile()

    service = module.get<HarvestService>(HarvestService)
    harvestRepository = module.get(getRepositoryToken(Harvest))
    farmRepository = module.get(getRepositoryToken(Farm))
    cropRepository = module.get(getRepositoryToken(Crop))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a harvest", async () => {
      const createHarvestDto: CreateHarvestDto = {
        name: "Safra Verão",
        farmId: "uuid-farm-1",
        crops: [],
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(null)
      harvestRepository.create.mockReturnValue(mockHarvest)
      harvestRepository.save.mockResolvedValue(mockHarvest)

      const result = await service.create(createHarvestDto)

      expect(result).toEqual(mockHarvest)
      expect(farmRepository.findOne).toHaveBeenCalledWith({ where: { id: "uuid-farm-1" } })
      expect(harvestRepository.create).toHaveBeenCalledWith({
        name: "Safra Verão",
        farm: mockFarm,
        crops: [],
      })
      expect(harvestRepository.save).toHaveBeenCalledWith(mockHarvest)
    })

    it("should throw ConflictException if harvest with same name exists for farm", async () => {
      const createHarvestDto: CreateHarvestDto = {
        name: "Safra Verão",
        farmId: "uuid-farm-1",
        crops: [],
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(mockHarvest) 

      await expect(service.create(createHarvestDto)).rejects.toThrow(ConflictException)
    })

    it("should create a harvest with crops", async () => {
      const mockCrops = [
        { id: "crop-1", name: "Milho" },
        { id: "crop-2", name: "Soja" },
      ]

      const createHarvestDto: CreateHarvestDto = {
        name: "Safra Verão",
        farmId: "uuid-farm-1",
        crops: ["crop-1", "crop-2"],
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(null)
      cropRepository.findByIds.mockResolvedValue(mockCrops)

      const harvestWithCrops = {
        ...mockHarvest,
        crops: mockCrops,
      }

      harvestRepository.create.mockReturnValue(harvestWithCrops)
      harvestRepository.save.mockResolvedValue(harvestWithCrops)

      const result = await service.create(createHarvestDto)

      expect(result).toEqual(harvestWithCrops)
      expect(cropRepository.findByIds).toHaveBeenCalledWith(["crop-1", "crop-2"])
      expect(harvestRepository.create).toHaveBeenCalledWith({
        name: "Safra Verão",
        farm: mockFarm,
        crops: mockCrops,
      })
    })
  })

  describe("findAll", () => {
    it("should return all harvests", async () => {
      const harvests = [mockHarvest]
      harvestRepository.find.mockResolvedValue(harvests)

      const result = await service.findAll()

      expect(result).toEqual(harvests)
      expect(harvestRepository.find).toHaveBeenCalledWith({
        relations: ["crops"],
      })
    })
  })

  describe("findOne", () => {
    it("should return a single harvest by id", async () => {
      harvestRepository.findOne.mockResolvedValue(mockHarvest)

      const result = await service.findOne("uuid-harvest-1")

      expect(result).toEqual(mockHarvest)
      expect(harvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-harvest-1" },
        relations: ["crops"],
      })
    })

    it("should throw NotFoundException if harvest not found", async () => {
      harvestRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a harvest", async () => {
      const updateHarvestDto: UpdateHarvestDto = { name: "Safra Atualizada" }
      const updatedHarvest = { ...mockHarvest, name: "Safra Atualizada" }

      // Importante: Agora usamos findOne em vez de findOneBy
      harvestRepository.findOne.mockResolvedValue(mockHarvest)
      harvestRepository.save.mockResolvedValue(updatedHarvest)

      const result = await service.update("uuid-harvest-1", updateHarvestDto)

      expect(result).toEqual(updatedHarvest)
      expect(harvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-harvest-1" },
        relations: ["farm"],
      })
      expect(harvestRepository.save).toHaveBeenCalled()
    })

    it("should throw NotFoundException if harvest to update not found", async () => {
      harvestRepository.findOne.mockResolvedValue(null)

      await expect(service.update("invalid-id", { name: "test" })).rejects.toThrow(NotFoundException)
    })

    it("should throw ConflictException if update would create name conflict", async () => {
      const updateHarvestDto: UpdateHarvestDto = { name: "Safra Conflito" }

      harvestRepository.findOne.mockImplementation((options) => {
        if (options.where.id === "uuid-harvest-1") {
          return Promise.resolve(mockHarvest)
        }
        if (options.where.name === "Safra Conflito") {
          return Promise.resolve({
            id: "uuid-harvest-2",
            name: "Safra Conflito",
            farm: mockFarm,
          })
        }
        return Promise.resolve(null)
      })

      await expect(service.update("uuid-harvest-1", updateHarvestDto)).rejects.toThrow(ConflictException)
    })
  })

  describe("remove", () => {
    it("should delete a harvest", async () => {
      harvestRepository.findOneBy.mockResolvedValue(mockHarvest)
      harvestRepository.remove.mockResolvedValue(mockHarvest)

      const result = await service.remove("uuid-harvest-1")

      expect(result).toBeUndefined()
      expect(harvestRepository.findOneBy).toHaveBeenCalledWith({ id: "uuid-harvest-1" })
      expect(harvestRepository.remove).toHaveBeenCalledWith(mockHarvest)
    })

    it("should throw NotFoundException if harvest to delete not found", async () => {
      harvestRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })
})
