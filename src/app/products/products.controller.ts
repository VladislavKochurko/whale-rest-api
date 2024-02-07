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
import { CacheInterceptor } from '@nestjs/cache-manager';

import { Product } from './entities';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  public async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<number> {
    return this.productsService.remove(id);
  }
}
