import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ElasticsearchService as ElasticsearchClient } from '@nestjs/elasticsearch';

import { PRODUCT_INDEX } from './constants';
import { productMapping } from './mappings';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(private readonly elasticsearchClient: ElasticsearchClient) {}

  async onModuleInit() {
    await this.createProductIndex();
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
            throw new InternalServerErrorException(
              error,
              'Elasticsearch Error',
            );
          });
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Elasticsearch Error');
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
        throw new InternalServerErrorException(error, 'Elasticsearch Error');
      });
  }

  public async index({ index, entity }: { index: string; entity: any }) {
    return this.elasticsearchClient
      .index({ id: entity.id, index, document: entity })
      .catch((error) => {
        throw new InternalServerErrorException(error, 'Elasticsearch Error');
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
        throw new InternalServerErrorException(error, 'Elasticsearch Error');
      });
  }
}
