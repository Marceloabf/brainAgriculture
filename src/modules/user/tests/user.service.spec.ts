import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { createUserDto, createUser } from '../../../../test/e2e/factories/user.factory';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;


describe('UserService', () => {
  let service: UserService;
  let repo: MockRepo<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should create a user successfully', async () => {
    const dto = createUserDto();
    const user = await createUser();

    repo.findOne!.mockResolvedValue(null);
    repo.create!.mockReturnValue(user);
    repo.save!.mockResolvedValue(user);

    const result = await service.create(dto);
    expect(result).toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
  });

  it('should throw conflict if email already exists', async () => {
    const dto = createUserDto();
    repo.findOne!.mockResolvedValue(await createUser());

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should return all users', async () => {
    const users = [await createUser(), await createUser()];
    repo.find!.mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  it('should return one user by id', async () => {
    const user = await createUser();
    repo.findOne!.mockResolvedValue(user);

    const result = await service.findOne(user.id);
    expect(result).toEqual(user);
  });

  it('should throw NotFound when user does not exist', async () => {
    repo.findOne!.mockResolvedValue(null);
    await expect(service.findOne('wrong-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const user = await createUser();
    const dto: UpdateUserDto = { name: 'Updated Name' };

    repo.findOne!.mockResolvedValue(user);
    repo.save!.mockResolvedValue({ ...user, ...dto });

    const result = await service.update(user.id, dto);
    expect(result.name).toBe('Updated Name');
  });

  it('should remove a user', async () => {
    const user = await createUser();

    repo.findOne!.mockResolvedValue(user);
    repo.remove!.mockResolvedValue(undefined);

    await expect(service.remove(user.id)).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalledWith(user);
  });

  it('should find user by email', async () => {
    const user = await createUser();
    repo.findOne!.mockResolvedValue(user);

    const result = await service.findByEmail(user.email);
    expect(result).toEqual(user);
  });
});
