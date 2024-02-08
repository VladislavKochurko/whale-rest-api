import { BelongsToMany, Table } from 'sequelize-typescript';

import { ProductsCategoryProduct } from '../../core/db/models/products-category-product.model';
import { AbstractModel } from '../../core/db/models/abstract.model';
import { Product } from '../../products/models';

@Table
export class ProductsCategory extends AbstractModel {
  @BelongsToMany(() => Product, () => ProductsCategoryProduct)
  products: Product[];
}
