import { IsNotEmpty, IsString, Matches, ValidateNested, IsArray, IsOptional, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFarmDto } from 'src/modules/farm/dto/create-farm.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDocumentValidator } from 'src/common/validators/is-document.validator';

export class CreateProducerDto {
  @ApiProperty({ example: 'Manuel Barros' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '00000000000' })
  @IsString()
  @Validate(IsDocumentValidator)
  document: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms?: CreateFarmDto[];
}
