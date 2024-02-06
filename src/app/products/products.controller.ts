import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

import { UpdateResult } from "../common";
import { Product } from "./entities";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Post()
  public create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  public findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto): UpdateResult<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string): Promise<number> {
    return this.productsService.remove(id);
  }
}
