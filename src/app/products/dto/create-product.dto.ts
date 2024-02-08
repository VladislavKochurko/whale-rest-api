import { IsArray, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly categories: string[];
}
