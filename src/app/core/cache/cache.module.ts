import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { CacheService } from './cache.service';
import { RedisAdapter } from './redis.adapter';
import { ProductsModule } from '../../products/products.module';
import { ProductsCategoriesModule } from '../../products-categories/products-categories.module';

@Module({
  imports: [
    ProductsModule,
    ProductsCategoriesModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService, RedisAdapter],
  exports: [CacheService, RedisAdapter],
})
export class CacheModule {}
