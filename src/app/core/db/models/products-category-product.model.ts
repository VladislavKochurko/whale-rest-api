import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';

import { ProductsCategory } from '../../../products-categories/models/products-category.model';
import { Product } from '../../../products/models/product.model';

@Table
export class ProductsCategoryProduct extends Model<ProductsCategoryProduct> {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => ProductsCategory)
  @Column
  productCategoryId: number;
}
