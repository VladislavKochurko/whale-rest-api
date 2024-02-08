import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  public async create({
    name,
    categories,
  }: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create({
      name,
    });

    await product.$add('categories', categories);

    await this.cacheService.set(product.id, product);
    return product;
  }

  public async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  public async findOne(id: string): Promise<Product> {
    const cachedProduct = await this.cacheService.get<Product>(id);

    if (cachedProduct != null) {
      return cachedProduct;
    }

    const product = await this.productModel.findByPk(id);
    await this.cacheService.set(id, product);

    return product;
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productModel
      .update(updateProductDto, { where: { id } })
      .then(async () => {
        const updatedProduct = await this.productModel.findByPk(id);
        await this.cacheService.set(id, updatedProduct);
        return updatedProduct;
      });
  }

  public async remove(id: string): Promise<number> {
    await this.cacheService.del(id);
    return this.productModel.destroy({ where: { id } });
  }
}
