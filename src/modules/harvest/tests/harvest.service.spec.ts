import { faker } from '@faker-js/faker'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { createFarm } from '../../../../test/e2e/factories/farm.factory'
import { Crop } from '../../crop/entities/crop.entity'
import { Farm } from '../../farm/entities/farm.entity'
import { Harvest } from '../entities/harvest.entity'
import { HarvestService } from '../harvest.service'
import { createHarvest } from '../../../../test/e2e/factories/harvest.factory'

describe('HarvestService', () => {
  let service: HarvestService
  let harvestRepository: any
  let farmRepository: any
  let cropRepository: any

  const mockFarm = createFarm();
  const mockHarvest = createHarvest();

  beforeEach(async () => {
    const mockHarvestRepo = {
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

    const mockFarmRepo = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    }

    const mockCropRepo = {
      findByIds: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        { provide: getRepositoryToken(Harvest), useValue: mockHarvestRepo },
        { provide: getRepositoryToken(Farm), useValue: mockFarmRepo },
        { provide: getRepositoryToken(Crop), useValue: mockCropRepo },
      ],
    }).compile()

    service = module.get<HarvestService>(HarvestService)
    harvestRepository = module.get(getRepositoryToken(Harvest))
    farmRepository = module.get(getRepositoryToken(Farm))
    cropRepository = module.get(getRepositoryToken(Crop))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a harvest', async () => {
      const dto = {
        name: faker.word.words(2),
        farmId: mockFarm.id,
        crops: [],
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(null)
      harvestRepository.create.mockReturnValue(mockHarvest)
      harvestRepository.save.mockResolvedValue(mockHarvest)

      const result = await service.create(dto)

      expect(result).toEqual(mockHarvest)
    })

    it('should throw ConflictException if harvest with same name exists', async () => {
      const dto = {
        name: mockHarvest.name,
        farmId: mockFarm.id,
        crops: [],
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(mockHarvest)

      await expect(service.create(dto)).rejects.toThrow(ConflictException)
    })

    it('should create a harvest with crops', async () => {
      const mockCrops = [
        { id: faker.string.uuid(), name: 'Milho' },
        { id: faker.string.uuid(), name: 'Soja' },
      ]

      const dto = {
        name: faker.word.words(2),
        farmId: mockFarm.id,
        crops: mockCrops.map(c => c.id),
      }

      farmRepository.findOne.mockResolvedValue(mockFarm)
      harvestRepository.findOne.mockResolvedValue(null)
      cropRepository.findByIds.mockResolvedValue(mockCrops)

      const harvestWithCrops = { ...mockHarvest, crops: mockCrops }

      harvestRepository.create.mockReturnValue(harvestWithCrops)
      harvestRepository.save.mockResolvedValue(harvestWithCrops)

      const result = await service.create(dto)

      expect(result).toEqual(harvestWithCrops)
    })
  })

  describe('findAll', () => {
    it('should return all harvests', async () => {
      harvestRepository.find.mockResolvedValue([mockHarvest])

      const result = await service.findAll()

      expect(result).toEqual([mockHarvest])
    })
  })

  describe('findOne', () => {
    it('should return one harvest', async () => {
      harvestRepository.findOne.mockResolvedValue(mockHarvest)

      const result = await service.findOne(mockHarvest.id)

      expect(result).toEqual(mockHarvest)
    })

    it('should throw NotFoundException if not found', async () => {
      harvestRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne(faker.string.uuid())).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update harvest', async () => {
      const dto = { name: 'Nova Safra' }
      const updated = { ...mockHarvest, ...dto }

      harvestRepository.findOne.mockResolvedValue(mockHarvest)
      harvestRepository.save.mockResolvedValue(updated)

      const result = await service.update(mockHarvest.id, dto)

      expect(result).toEqual(updated)
    })

    it('should throw NotFoundException if not found', async () => {
      harvestRepository.findOne.mockResolvedValue(null)

      await expect(service.update(faker.string.uuid(), { name: 'X' })).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if name already exists', async () => {
      const dto = { name: 'Safra Conflito' }

      harvestRepository.findOne.mockImplementation(({ where }) => {
        if (where.id) return Promise.resolve(mockHarvest)
        if (where.name) return Promise.resolve({ id: faker.string.uuid(), name: dto.name, farm: mockFarm })
        return Promise.resolve(null)
      })

      await expect(service.update(mockHarvest.id, dto)).rejects.toThrow(ConflictException)
    })
  })

  describe('remove', () => {
    it('should delete harvest', async () => {
      harvestRepository.findOneBy.mockResolvedValue(mockHarvest)
      harvestRepository.remove.mockResolvedValue(mockHarvest)

      const result = await service.remove(mockHarvest.id)

      expect(result).toBeUndefined()
    })

    it('should throw NotFoundException if not found', async () => {
      harvestRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(faker.string.uuid())).rejects.toThrow(NotFoundException)
    })
  })
})
