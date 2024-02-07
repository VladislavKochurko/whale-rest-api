import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UpdateResult } from '../common';
import { CreateProductsCategoryDto, UpdateProductsCategoryDto } from './dto';
import { ProductsCategory } from './entities';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectModel(ProductsCategory)
    private readonly productsCategoryModel: typeof ProductsCategory,
  ) {}
  public async create({
    name,
    slug,
  }: CreateProductsCategoryDto): Promise<ProductsCategory> {
    return this.productsCategoryModel.create({
      name,
      slug,
    });
  }

  public async findAll(): Promise<ProductsCategory[]> {
    return this.productsCategoryModel.findAll();
  }

  public async findOne(id: string): Promise<ProductsCategory> {
    return this.productsCategoryModel.findByPk(id);
  }

  public async update(
    id: string,
    updateProductsCategoryDto: UpdateProductsCategoryDto,
  ): UpdateResult<ProductsCategory> {
    return this.productsCategoryModel.update(updateProductsCategoryDto, {
      where: { id },
    });
  }

  public async remove(id: string): Promise<number> {
    return this.productsCategoryModel.destroy({ where: { id } });
  }
}
