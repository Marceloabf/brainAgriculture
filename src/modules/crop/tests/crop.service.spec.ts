import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common"
import { CropService } from "../crop.service"
import { Crop } from "../entities/crop.entity"
import type { CreateCropDto } from "../dto/create-crop.dto"
import type { UpdateCropDto } from "../dto/update-crop.dto"
import { jest } from "@jest/globals"

describe("CropService", () => {
  let service: CropService
  let cropRepository: any

  const mockCrop = {
    id: "uuid-crop-1",
    name: "Milho",
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const mockCropRepository = {
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
        CropService,
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
      ],
    }).compile()

    service = module.get<CropService>(CropService)
    cropRepository = module.get(getRepositoryToken(Crop))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a crop", async () => {
      const createCropDto: CreateCropDto = {
        name: "Milho",
      }

      cropRepository.findOne.mockResolvedValue(null)
      cropRepository.create.mockReturnValue(mockCrop)
      cropRepository.save.mockResolvedValue(mockCrop)

      const result = await service.create(createCropDto)

      expect(result).toEqual(mockCrop)
      expect(cropRepository.findOne).toHaveBeenCalledWith({
        where: { name: "Milho" },
      })
      expect(cropRepository.create).toHaveBeenCalledWith({
        name: "Milho",
      })
      expect(cropRepository.save).toHaveBeenCalledWith(mockCrop)
    })

    it("should throw ConflictException if crop with same name exists", async () => {
      const createCropDto: CreateCropDto = {
        name: "Milho",
      }

      cropRepository.findOne.mockResolvedValue(mockCrop) 

      await expect(service.create(createCropDto)).rejects.toThrow(ConflictException)
      expect(cropRepository.findOne).toHaveBeenCalledWith({
        where: { name: "Milho" },
      })
    })

    it("should throw InternalServerErrorException if save fails", async () => {
      const createCropDto: CreateCropDto = {
        name: "Milho",
      }

      cropRepository.findOne.mockResolvedValue(null)
      cropRepository.create.mockReturnValue(mockCrop)
      cropRepository.save.mockRejectedValue(new Error("Database error"))

      await expect(service.create(createCropDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe("findAll", () => {
    it("should return all crops", async () => {
      const crops = [mockCrop]
      cropRepository.find.mockResolvedValue(crops)

      const result = await service.findAll()

      expect(result).toEqual(crops)
      expect(cropRepository.find).toHaveBeenCalledWith({
        relations: ["harvest"],
      })
    })

    it("should throw InternalServerErrorException if find fails", async () => {
      cropRepository.find.mockImplementation(() => {
        throw new Error("Database error")
      })

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe("findOne", () => {
    it("should return a single crop by id", async () => {
      cropRepository.findOne.mockResolvedValue(mockCrop)

      const result = await service.findOne("uuid-crop-1")

      expect(result).toEqual(mockCrop)
      expect(cropRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-crop-1" },
        relations: ["harvest"],
      })
    })

    it("should throw NotFoundException if crop not found", async () => {
      cropRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update and return the crop", async () => {
      const updateCropDto: UpdateCropDto = { name: "Milho Atualizado" }
      const updatedCrop = { ...mockCrop, name: "Milho Atualizado" }

      cropRepository.findOne.mockResolvedValue(mockCrop)
      cropRepository.save.mockResolvedValue(updatedCrop)

      const result = await service.update("uuid-crop-1", updateCropDto)

      expect(result).toEqual(updatedCrop)
      expect(cropRepository.findOne).toHaveBeenCalledWith({ where: { id: "uuid-crop-1" } })
      expect(cropRepository.save).toHaveBeenCalled()
    })

    it("should throw NotFoundException if crop to update not found", async () => {
      const updateCropDto: UpdateCropDto = { name: "Milho Atualizado" }

      cropRepository.findOne.mockResolvedValue(null)

      await expect(service.update("invalid-id", updateCropDto)).rejects.toThrow(NotFoundException)
      expect(cropRepository.findOne).toHaveBeenCalledWith({ where: { id: "invalid-id" } })
    })

    it("should throw InternalServerErrorException if save fails", async () => {
      const updateCropDto: UpdateCropDto = { name: "Milho Atualizado" }

      cropRepository.findOne.mockResolvedValue(mockCrop)
      cropRepository.save.mockImplementation(() => {
        throw new Error("Database error")
      })

      await expect(service.update("uuid-crop-1", updateCropDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe("remove", () => {
    it("should remove the crop", async () => {
      cropRepository.findOne.mockResolvedValue(mockCrop)
      cropRepository.remove.mockResolvedValue(undefined)

      const result = await service.remove("uuid-crop-1")

      expect(result).toBeUndefined() 
      expect(cropRepository.findOne).toHaveBeenCalledWith({ where: { id: "uuid-crop-1" } })
      expect(cropRepository.remove).toHaveBeenCalledWith(mockCrop)
    })

    it("should throw NotFoundException if crop to remove not found", async () => {
      cropRepository.findOne.mockResolvedValue(null)

      await expect(service.remove("invalid-id")).rejects.toThrow(NotFoundException)
      expect(cropRepository.findOne).toHaveBeenCalledWith({ where: { id: "invalid-id" } })
    })

    it("should throw InternalServerErrorException if remove fails", async () => {
      cropRepository.findOne.mockResolvedValue(mockCrop)
      cropRepository.remove.mockImplementation(() => {
        throw new Error("Database error")
      })

      await expect(service.remove("uuid-crop-1")).rejects.toThrow(InternalServerErrorException)
    })
  })
})
