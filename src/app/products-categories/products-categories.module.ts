import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProductsCategoryProduct } from '../core';
import { ProductsCategory } from './models';
import { ProductsCategoriesService } from './products-categories.service';
import { ProductsCategoriesController } from './products-categories.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductsCategory, ProductsCategoryProduct]),
  ],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
  exports: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
