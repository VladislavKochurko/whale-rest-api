import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UpdateResult } from '../common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  public async create({ name, slug }: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      name,
      slug,
    });
  }

  public async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  public async findOne(id: string): Promise<Product> {
    return this.productModel.findByPk(id);
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): UpdateResult<Product> {
    return this.productModel.update(updateProductDto, { where: { id } });
  }

  public async remove(id: string): Promise<number> {
    return this.productModel.destroy({ where: { id } });
  }
}
