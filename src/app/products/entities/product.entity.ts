import { HasMany, Table } from 'sequelize-typescript';

import { AbstractEntity } from '../../core';
import { ProductsCategory } from '../../products-categories/entities';

@Table
export class Product extends AbstractEntity {
  @HasMany(() => ProductsCategory)
  categories: ProductsCategory[];
}
