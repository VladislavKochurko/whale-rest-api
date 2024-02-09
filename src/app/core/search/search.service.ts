import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { ElasticsearchService as ElasticsearchClient } from '@nestjs/elasticsearch';

import { PRODUCT_INDEX } from './constants';
import { productMapping } from './mappings';
import { ElasticSearchException } from '../../common';
import { Product } from '../../products/models';

@Injectable()
export class SearchService implements OnApplicationBootstrap {
  constructor(
    private readonly elasticsearchClient: ElasticsearchClient,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.syncElasticWithPostgres();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async handleCron(): Promise<void> {
    await this.createProductIndex();
  }

  private async syncElasticWithPostgres(): Promise<void> {
    await this.createProductIndex();
    const products = await this.productModel.findAll();
    await Promise.all(
      products.map(async ({ id, name }) =>
        this.index({
          index: PRODUCT_INDEX,
          entity: { id, name },
        }),
      ),
    );
  }

  public async createProductIndex(): Promise<any> {
    try {
      const isProductsIndexExists =
        await this.elasticsearchClient.indices.exists({ index: PRODUCT_INDEX });

      if (!isProductsIndexExists) {
        await this.elasticsearchClient.indices
          .create({
            index: PRODUCT_INDEX,
            mappings: productMapping,
          })
          .catch((error: Error) => {
            throw new ElasticSearchException(error);
          });
      }
    } catch (error) {
      throw new ElasticSearchException(error);
    }
  }

  public async search({ index, text }: { index: string; text: string }) {
    return this.elasticsearchClient
      .search({
        index,
        query: {
          fuzzy: {
            name: {
              value: text,
              fuzziness: 'AUTO',
              max_expansions: 50,
              prefix_length: 0,
              transpositions: true,
              rewrite: 'constant_score_blended',
            },
          },
        },
      })
      .then((response) => {
        return response.hits.hits.map((document) => document._source);
      })
      .catch((error) => {
        throw new ElasticSearchException(error);
      });
  }

  public async index<T extends { id: string }>({
    index,
    entity,
  }: {
    index: string;
    entity: T;
  }) {
    return this.elasticsearchClient
      .index({ id: entity.id, index, document: entity })
      .catch((error) => {
        throw new ElasticSearchException(error);
      });
  }

  public async remove({
    index,
    entityId,
  }: {
    index: string;
    entityId: string;
  }) {
    return this.elasticsearchClient
      .delete({ id: entityId, index })
      .catch((error) => {
        throw new ElasticSearchException(error);
      });
  }
}
