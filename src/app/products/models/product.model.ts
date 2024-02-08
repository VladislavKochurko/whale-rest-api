import { BelongsToMany, Table } from 'sequelize-typescript';

import { ProductsCategoryProduct } from '../../core/db/models/products-category-product.model';
import { AbstractModel } from '../../core/db/models/abstract.model';
import { ProductsCategory } from '../../products-categories/models';

@Table
export class Product extends AbstractModel {
  @BelongsToMany(() => ProductsCategory, () => ProductsCategoryProduct)
  categories: ProductsCategory[];
}
