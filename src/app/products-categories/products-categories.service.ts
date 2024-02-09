import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateProductsCategoryDto, UpdateProductsCategoryDto } from './dto';
import { ProductsCategory } from './models';
import { CacheNamespace } from '../core/cache/cache.constants';
import { RedisAdapter } from '../core/cache/redis.adapter';
import { ALL_KEY, getCacheKey } from '../common';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectModel(ProductsCategory)
    private readonly productsCategoryModel: typeof ProductsCategory,
    private readonly redisAdapter: RedisAdapter,
  ) {}
  public async create({
    name,
  }: CreateProductsCategoryDto): Promise<ProductsCategory> {
    const category = await this.productsCategoryModel.create({
      name,
    });
    await this.redisAdapter.set<ProductsCategory>(
      getCacheKey(CacheNamespace.ProductsCategories, category.id),
      category,
    );

    return category;
  }

  public async findAll(): Promise<ProductsCategory[]> {
    const cachedCategories = await this.redisAdapter.mget<ProductsCategory>(
      getCacheKey(CacheNamespace.ProductsCategories, ALL_KEY),
    );

    if (cachedCategories != null) {
      return cachedCategories;
    }

    return await this.productsCategoryModel.findAll();
  }

  public async findOne(id: string): Promise<ProductsCategory> {
    const cachedCategory = await this.redisAdapter.get<ProductsCategory>(
      getCacheKey(CacheNamespace.ProductsCategories, id),
    );

    if (cachedCategory != null) {
      return cachedCategory;
    }

    const category = await this.productsCategoryModel.findOne({
      where: { id },
    });

    if (category == null) {
      throw new NotFoundException('Product Category not found');
    }

    await this.redisAdapter.set<ProductsCategory>(
      getCacheKey(CacheNamespace.ProductsCategories, id),
      category,
    );

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

        await this.redisAdapter.set<ProductsCategory>(
          getCacheKey(CacheNamespace.ProductsCategories, id),
          updatedCategory,
        );

        return updatedCategory;
      });
  }

  public async remove(id: string): Promise<number> {
    await this.redisAdapter.del(
      getCacheKey(CacheNamespace.ProductsCategories, id),
    );

    return this.productsCategoryModel.destroy({ where: { id } });
  }
}
