import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ProductsService } from '../../products/products.service';
import { ProductsCategoriesService } from '../../products-categories/products-categories.service';
import { RedisAdapter } from './redis.adapter';
import { CacheNamespace } from './cache.constants';
import { Product } from '../../products/models';
import { ProductsCategory } from '../../products-categories/models';
import { RefreshCacheException } from '../../common';

@Injectable()
export class CacheService implements OnApplicationBootstrap {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsCategoriesService: ProductsCategoriesService,
    private readonly redisAdapter: RedisAdapter,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.refreshCache();
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async handleCron(): Promise<void> {
    await this.refreshCache();
  }

  public async refreshCache(): Promise<void> {
    try {
      const [products, categories] = await Promise.all([
        this.productsService.findAll(),
        this.productsCategoriesService.findAll(),
      ]);

      await Promise.all([
        this.redisAdapter.setMany<Product>(CacheNamespace.Products, products),
        this.redisAdapter.setMany<ProductsCategory>(
          CacheNamespace.ProductsCategories,
          categories,
        ),
      ]);
    } catch (error) {
      throw new RefreshCacheException(error);
    }
  }
}
