import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';

import { CreateProductsCategoryDto, UpdateProductsCategoryDto } from './dto';
import { ProductsCategory } from './entities';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectModel(ProductsCategory)
    private readonly productsCategoryModel: typeof ProductsCategory,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  public async create({
    name,
    slug,
  }: CreateProductsCategoryDto): Promise<ProductsCategory> {
    const category = await this.productsCategoryModel.create({
      name,
      slug,
    });
    await this.cacheService.set(category.id, category);

    return category;
  }

  public async findAll(): Promise<ProductsCategory[]> {
    return this.productsCategoryModel.findAll();
  }

  public async findOne(id: string): Promise<ProductsCategory> {
    const cachedCategory = await this.cacheService.get<ProductsCategory>(id);

    if (cachedCategory != null) {
      return cachedCategory;
    }

    const category = await this.productsCategoryModel.findByPk(id);
    await this.cacheService.set(id, category);

    return category;
  }

  public async update(
    id: string,
    updateProductsCategoryDto: UpdateProductsCategoryDto,
  ): Promise<ProductsCategory> {
    return this.productsCategoryModel
      .update(updateProductsCategoryDto, {
        where: { id },
      })
      .then(async () => {
        const updatedCategory = await this.productsCategoryModel.findByPk(id);
        await this.cacheService.set(id, updatedCategory);
        return updatedCategory;
      });
  }

  public async remove(id: string): Promise<number> {
    await this.cacheService.del(id);
    return this.productsCategoryModel.destroy({ where: { id } });
  }
}
