import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({ example: 'Fazenda Primavera' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  agriculturalArea: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({ example: 'uuid-producer-1' })
  @IsUUID()
  @IsNotEmpty()
  producerId: string;
}
