import { Module } from '@nestjs/common';
import { CoreModule } from './app/core/core.module';

import { ProductsCategoriesModule } from './app/products-categories/products-categories.module';
import { ProductsModule } from './app/products/products.module';

@Module({
  imports: [CoreModule, ProductsModule, ProductsCategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
