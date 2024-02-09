import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as util from 'util';

import { getCacheKey, RedisOperationFailedException } from '../../common';
import { CacheNamespace } from './cache.constants';

@Injectable()
export class RedisAdapter {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private configService: ConfigService,
  ) {}

  public async get<T>(key: string): Promise<T | null> {
    const getAsync = util
      .promisify(this.redisClient.get)
      .bind(this.redisClient);

    const cachedData = await getAsync(key).catch((error) => {
      throw new RedisOperationFailedException(error);
    });

    return JSON.parse(cachedData);
  }

  public async set<T>(
    key: string,
    value: T,
    ttl: number = this.configService.get('CACHE_TTL'),
  ): Promise<void> {
    this.redisClient
      .set(key, JSON.stringify(value), 'EX', ttl)
      .catch((error) => {
        throw new RedisOperationFailedException(error);
      });
  }

  public async del(key: string): Promise<void> {
    const delAsync = util
      .promisify(this.redisClient.del)
      .bind(this.redisClient);

    await delAsync(key).catch((error) => {
      throw new RedisOperationFailedException(error);
    });
  }

  public async mget<T>(key: string): Promise<T[] | null> {
    const mgetAsync = util
      .promisify(this.redisClient.mget)
      .bind(this.redisClient);

    const cachedData = await mgetAsync(key)
      .then((data: T[]) => {
        const filteredData = data.filter((data) => data != null);
        return filteredData.length > 0 ? filteredData : null;
      })
      .catch((error) => {
        throw new RedisOperationFailedException(error);
      });
    return JSON.parse(cachedData);
  }

  public async setMany<T extends { id: string }>(
    prefix: CacheNamespace,
    documents: T[],
    ttl: number = this.configService.get('CACHE_TTL'),
  ): Promise<void> {
    await Promise.all(
      documents.map(async (document: T) =>
        this.redisClient.set(
          getCacheKey(prefix, document.id),
          JSON.stringify(document),
          'EX',
          ttl,
        ),
      ),
    ).catch((error) => {
      throw new RedisOperationFailedException(error);
    });
  }
}
