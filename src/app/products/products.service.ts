import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';

import { PRODUCT_INDEX } from '../core/search';
import { SearchService } from '../core/search/search.service';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly searchService: SearchService,
  ) {}

  public async create({
    name,
    categories,
  }: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create({
      name,
    });

    await product.$add('categories', categories);

    await Promise.all([
      this.searchService.index({
        index: PRODUCT_INDEX,
        entity: { id: product.id, name: product.name },
      }),
      this.cacheService.set(product.id, product),
    ]);
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
        await Promise.all([
          this.searchService.index({
            index: PRODUCT_INDEX,
            entity: { id: updatedProduct.id, name: updatedProduct.name },
          }),
          this.cacheService.set(updatedProduct.id, updatedProduct),
        ]);
        return updatedProduct;
      });
  }

  public async remove(id: string): Promise<number> {
    return this.productModel
      .destroy({ where: { id } })
      .then(async (response) => {
        await Promise.all([
          this.searchService.remove({
            index: PRODUCT_INDEX,
            entityId: id,
          }),
          this.cacheService.del(id),
        ]);
        return response;
      });
  }

  public async searchByName(name: string): Promise<Product[]> {
    return this.searchService
      .search({
        index: PRODUCT_INDEX,
        text: name,
      })
      .then(async (products: { id: string; name: string }[]) => {
        return products.length > 0
          ? this.productModel.findAll({
              where: { id: products.map((product) => product.id) },
            })
          : [];
      });
  }
}
