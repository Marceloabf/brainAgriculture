import { IsNotEmpty, IsString, Matches, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFarmDto } from 'src/modules/farm/dto/create-farm.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty({ example: 'Manuel Barros' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '00000000000' })
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, { message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)' })
  document: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms?: CreateFarmDto[];
}
