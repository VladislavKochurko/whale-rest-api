import { IsString } from 'class-validator';

export class CreateProductsCategoryDto {
  @IsString()
  readonly name: string;
}
