import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.warn(`Usuário com e-mail ${email} não encontrado`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Senha inválida para o e-mail ${email}`);
      return null;
    }

    return user;
  }

  async login(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    this.logger.log(`Login realizado com sucesso para o usuário ${user.email}`);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, role: payload.role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      this.logger.log(`Access token renovado para o usuário ID ${payload.sub}`);
      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.error('Erro ao validar o refresh token', error.stack);
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }
}
