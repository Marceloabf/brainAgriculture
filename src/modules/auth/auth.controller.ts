import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}
    
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  if (!user) throw new UnauthorizedException();
  return this.authService.login(user);
}

@Post('refresh-token')
async refresh(@Body() dto: RefreshTokenDto) {
  return this.authService.refreshToken(dto.refreshToken);
}
}