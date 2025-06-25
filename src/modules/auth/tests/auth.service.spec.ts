import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user when email and password are valid', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', password: 'hashed' };
      userService.findByEmail!.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(mockUser.email, 'plainPassword');

      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userService.findByEmail!.mockResolvedValue(null);

      const result = await service.validateUser('invalid@example.com', 'password');

      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith('invalid@example.com');
    });

    it('should return null if password is invalid', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', password: 'hashed' };
      userService.findByEmail!.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(mockUser.email, 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return accessToken and refreshToken', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', role: 'ADMIN' };
      jwtService.sign!.mockImplementation((payload) => `token-for-${payload.sub}`);

      const result = await service.login(mockUser as any);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'token-for-user1',
        refreshToken: 'token-for-user1',
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new accessToken if refresh token is valid', async () => {
      const payload = { sub: 'user1', role: 'ADMIN' };
      jwtService.verifyAsync!.mockResolvedValue(payload);
      jwtService.sign!.mockReturnValue('newAccessToken');

      const result = await service.refreshToken('validRefreshToken');

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('validRefreshToken', {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: payload.sub, role: payload.role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );
      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jwtService.verifyAsync!.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
