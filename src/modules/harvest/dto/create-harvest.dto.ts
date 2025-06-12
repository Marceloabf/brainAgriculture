import { IsNotEmpty, IsString, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCropDto } from 'src/modules/crop/dto/create-crop.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty({ example: 'Safra 2020' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-farm-1' })
  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @ApiProperty({
  type: [CreateCropDto],
  description: 'Lista de culturas (crops) pertencentes à safra',
  })
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCropDto)
  crops: CreateCropDto[];
}
