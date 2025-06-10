import { IsNotEmpty, IsString, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCropDto } from 'src/modules/crop/dto/create-crop.dto';

export class CreateHarvestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCropDto)
  crops: CreateCropDto[];
}
