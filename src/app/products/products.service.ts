import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { PRODUCT_INDEX, ElasticProduct } from '../core/search';
import { SearchService } from '../core/search/search.service';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './models';
import { RedisAdapter } from '../core/cache/redis.adapter';
import { CacheNamespace } from '../core/cache/cache.constants';
import { ALL_KEY, getCacheKey } from '../common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly searchService: SearchService,
    private readonly redisAdapter: RedisAdapter,
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
      this.searchService.index<ElasticProduct>({
        index: PRODUCT_INDEX,
        entity: { id: product.id, name: product.name },
      }),
      this.redisAdapter.set<Product>(
        getCacheKey(CacheNamespace.Products, product.id),
        product,
      ),
    ]);

    return product;
  }

  public async findAll(): Promise<Product[]> {
    const cachedProducts = await this.redisAdapter.mget<Product>(
      getCacheKey(CacheNamespace.Products, ALL_KEY),
    );

    if (cachedProducts != null) {
      return cachedProducts;
    }

    return await this.productModel.findAll();
  }

  public async findOne(id: string): Promise<Product> {
    const cachedProduct = await this.redisAdapter.get<Product>(
      getCacheKey(CacheNamespace.Products, id),
    );

    if (cachedProduct != null) {
      return cachedProduct;
    }
    const product = await this.productModel.findOne({ where: { id } });

    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    await this.redisAdapter.set<Product>(
      getCacheKey(CacheNamespace.Products, id),
      product,
    );

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

        if (updateProductDto.categories != null) {
          await updatedProduct.$set('categories', updateProductDto.categories);
        }

        await Promise.all([
          this.searchService.index<ElasticProduct>({
            index: PRODUCT_INDEX,
            entity: { id: updatedProduct.id, name: updatedProduct.name },
          }),
          this.redisAdapter.set<Product>(
            getCacheKey(CacheNamespace.Products, id),
            updatedProduct,
          ),
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
          this.redisAdapter.del(getCacheKey(CacheNamespace.Products, id)),
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
