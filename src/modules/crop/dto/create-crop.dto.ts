import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCropDto {
  @IsString()
  @IsNotEmpty()
  name: string; 

  @IsUUID()
  @IsNotEmpty()
  harvestId: string;
}
