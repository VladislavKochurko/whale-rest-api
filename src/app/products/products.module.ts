import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProductsCategoryProduct } from '../core';
import { Product } from './models';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductsCategoryProduct])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
