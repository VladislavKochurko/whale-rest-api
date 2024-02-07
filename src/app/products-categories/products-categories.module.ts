import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProductsCategory } from './entities';
import { ProductsCategoriesService } from './products-categories.service';
import { ProductsCategoriesController } from './products-categories.controller';

@Module({
  imports: [SequelizeModule.forFeature([ProductsCategory])],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
