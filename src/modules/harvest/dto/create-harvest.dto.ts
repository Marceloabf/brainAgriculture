import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCropDto } from 'src/modules/crop/dto/create-crop.dto';

export class CreateHarvestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'O ID da fazenda deve ser uma string.' })
  farmId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCropDto)
  crops: CreateCropDto[];
}
