import { IsNotEmpty, IsString, IsNumber, Min, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHarvestDto } from 'src/modules/harvest/dto/create-harvest.dto';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNumber()
  @Min(0)
  totalArea: number;

  @IsNumber()
  @Min(0)
  agriculturalArea: number;

  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestDto)
  harvests: CreateHarvestDto[];

  @IsUUID()
  @IsNotEmpty()
  producerId: string;
}
