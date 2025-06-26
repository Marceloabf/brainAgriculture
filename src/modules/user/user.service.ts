import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Tentativa de criar usuário com e-mail: ${dto.email}`);

    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      this.logger.warn(`Tentativa de cadastro com email já existente: ${dto.email}`);
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const user = this.userRepository.create(dto);

    try {
      const saved = await this.userRepository.save(user);
      this.logger.log(`Usuário criado com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Erro ao salvar usuário.', error.stack);
      throw new InternalServerErrorException('Erro ao salvar usuário.');
    }
  }

  async findAll(): Promise<User[]> {
     this.logger.log('Buscando todos os usuários');

    try {
      const users = await this.userRepository.find();
      this.logger.log(`Retornados ${users.length} usuários`);
      return users;
    } catch (error) {
      this.logger.error('Erro ao buscar usuários.', error.stack);
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Buscando usuário com ID: ${id}`);

    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        this.logger.error(`Usuário com ID ${id} não encontrado.`);
        throw new NotFoundException('Usuário não encontrado.');
      }

      this.logger.log(`Usuário encontrado: ID ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário ID ${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Erro ao buscar usuário.');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    this.logger.log(`Atualizando usuário ID ${id} com dados: ${JSON.stringify(dto)}`);

    const user = await this.findOne(id);
    Object.assign(user, dto);

    try {
      const saved = await this.userRepository.save(user);
      this.logger.log(`Usuário atualizado com sucesso: ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async remove(id: string): Promise<void> {
   this.logger.log(`Removendo usuário ID ${id}`);

    const user = await this.findOne(id);

    try {
      await this.userRepository.remove(user);
      this.logger.log(`Usuário removido com sucesso: ID ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover usuário ID ${id}`, error.stack);
      throw new InternalServerErrorException('Erro ao remover usuário.');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
   this.logger.log(`Buscando usuário por e-mail: ${email}`);

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        this.logger.log(`Usuário encontrado: ID ${user.id}`);
      } else {
        this.logger.warn(`Nenhum usuário encontrado com o e-mail ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por e-mail: ${email}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar usuário por e-mail.');
    }
  }
}
