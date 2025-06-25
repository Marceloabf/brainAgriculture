import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens when valid credentials', async () => {
      const dto = { email: 'user@test.com', password: 'Password123' };
      const user = { id: 'uuid-user-1', email: dto.email, role: 'ADMIN' };
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(dto);

      expect(service.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(tokens);
    });

    it('should throw UnauthorizedException when invalid credentials', async () => {
      const dto = { email: 'user@test.com', password: 'wrongpass' };
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(service.login).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should return new access token', async () => {
      const dto = { refreshToken: 'some-refresh-token' };
      const newAccessToken = { accessToken: 'new-access-token' };

      mockAuthService.refreshToken.mockResolvedValue(newAccessToken);

      const result = await controller.refresh(dto);

      expect(service.refreshToken).toHaveBeenCalledWith(dto.refreshToken);
      expect(result).toEqual(newAccessToken);
    });
  });
});
