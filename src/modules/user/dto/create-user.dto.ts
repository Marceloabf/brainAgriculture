import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Manuel Barros' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Manuel@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SenhaExemplo123*' })
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'A senha deve ter no máximo 20 caracteres, conter letra maiúscula, minúscula, número e caractere especial.',
  })
  password: string;

  @ApiProperty({ example: 'admin' })
  @IsEnum(UserRole, {
    message:
      'Role inválido. Os valores permitidos são: admin, gestor ou funcionário.',
  })
  role: UserRole;
}
