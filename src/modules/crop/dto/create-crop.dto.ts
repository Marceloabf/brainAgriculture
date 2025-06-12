import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ example: 'Arroz' })
  @IsString()
  @IsNotEmpty()
  name: string; 

  @ApiProperty({ example: 'uuid-harvest-1' })
  @IsUUID()
  @IsNotEmpty()
  harvestId: string;
}
