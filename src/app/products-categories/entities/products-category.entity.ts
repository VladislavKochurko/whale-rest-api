import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { AbstractEntity } from '../../core';
import { Product } from '../../products/entities';

@Table
export class ProductsCategory extends AbstractEntity {
  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  productId: string;

  @BelongsTo(() => Product)
  product: Product;
}
