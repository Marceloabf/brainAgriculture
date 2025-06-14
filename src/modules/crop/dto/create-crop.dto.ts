import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ example: 'Arroz' })
  @IsString()
  @IsNotEmpty()
  name: string; 
}
