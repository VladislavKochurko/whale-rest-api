import { Module } from '@nestjs/common';
import { CoreModule } from './app/core/core.module';

import { ProductsCategoriesModule } from './app/products-categories/products-categories.module';
import { ProductsModule } from './app/products/products.module';
import { CacheModule } from './app/core/cache/cache.module';

@Module({
  imports: [CoreModule, ProductsModule, ProductsCategoriesModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
