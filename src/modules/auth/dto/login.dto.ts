import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'Manuel@gmail.com',
    description: 'E-mail do usuário para login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SenhaExemplo123*',
    description: 'Senha do usuário',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
