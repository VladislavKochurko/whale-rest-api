import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UpdateResult } from '../common';
import { ProductsCategory } from './entities';
import { ProductsCategoriesService } from './products-categories.service';
import { CreateProductsCategoryDto, UpdateProductsCategoryDto } from './dto';

@Controller('products-categories')
export class ProductsCategoriesController {
  constructor(
    private readonly productsCategoriesService: ProductsCategoriesService,
  ) {}

  @Post()
  public async create(
    @Body() createProductsCategoryDto: CreateProductsCategoryDto,
  ): Promise<ProductsCategory> {
    return this.productsCategoriesService.create(createProductsCategoryDto);
  }

  @Get()
  public async findAll(): Promise<ProductsCategory[]> {
    return this.productsCategoriesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<ProductsCategory> {
    return this.productsCategoriesService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateProductsCategoryDto: UpdateProductsCategoryDto,
  ): UpdateResult<ProductsCategory> {
    return this.productsCategoriesService.update(id, updateProductsCategoryDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<number> {
    return this.productsCategoriesService.remove(id);
  }
}
