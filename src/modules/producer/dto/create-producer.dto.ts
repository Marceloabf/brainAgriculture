import { IsNotEmpty, IsString, Matches, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFarmDto } from 'src/modules/farm/dto/create-farm.dto';

export class CreateProducerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, { message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)' })
  document: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms: CreateFarmDto[];
}
