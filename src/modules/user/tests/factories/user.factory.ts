import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User, UserRole } from '../../entities/user.entity';

export const createUserDto = (): CreateUserDto => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.ADMIN,
});

export const createUser = async (): Promise<User> => {
  const user = new User();
  user.id = faker.string.uuid();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.role = UserRole.FUNCIONARIO;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  await user.hashPassword();
  return user;
};
