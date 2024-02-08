import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsCategory } from './models';
import { ProductsCategoriesService } from './products-categories.service';
import { CreateProductsCategoryDto, UpdateProductsCategoryDto } from './dto';

@UseInterceptors(CacheInterceptor)
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
  ): Promise<ProductsCategory> {
    return this.productsCategoriesService.update(id, updateProductsCategoryDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<number> {
    return this.productsCategoriesService.remove(id);
  }
}
