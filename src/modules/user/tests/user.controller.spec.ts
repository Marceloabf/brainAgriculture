import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createUser, createUserDto } from '../../../../test/e2e/factories/user.factory';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = createUserDto();
    const createdUser = { id: 'uuid-create-user', ...dto, createdAt: new Date(), updatedAt: new Date() };

    mockUserService.create.mockResolvedValue(createdUser);

    const result = await controller.create(dto);
    expect(result).toEqual(createdUser);
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

 describe('findAll', () => {
  it('should return paginated users with metadata', async () => {
    const paginationQuery = { page: 1, limit: 10 };
    const users = await Promise.all([createUser(), createUser(), createUser()]);
    const meta = {
      totalItems: users.length,
      itemCount: users.length,
      itemsPerPage: paginationQuery.limit,
      totalPages: 1,
      currentPage: paginationQuery.page,
    };

    const paginatedResult = { data: users, meta };

    mockUserService.findAll.mockResolvedValue(paginatedResult);

    const result = await controller.findAll(paginationQuery);

    expect(mockUserService.findAll).toHaveBeenCalledWith(paginationQuery);
    expect(result).toEqual(paginatedResult);
  });
});


  it('should find user by email', async () => {
    const user = await createUser();

    mockUserService.findByEmail.mockResolvedValue(user);

    const result = await controller.findByEmail(user.email);
    expect(result).toEqual(user);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('should update a user', async () => {
    const id = 'uuid-update-user';
    const dto = { name: 'Nome Atualizado' };
    const updatedUser = await createUser();
    updatedUser.name = dto.name;

    mockUserService.update.mockResolvedValue(updatedUser);

    const result = await controller.update(id, dto);
    expect(result).toEqual(updatedUser);
    expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a user', async () => {
    const id = 'uuid-remove-user';

    mockUserService.remove.mockResolvedValue(undefined);

    const result = await controller.remove(id);
    expect(result).toBeUndefined();
    expect(mockUserService.remove).toHaveBeenCalledWith(id);
  });
});
