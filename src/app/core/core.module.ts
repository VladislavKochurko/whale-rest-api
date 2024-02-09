import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';

import { SearchModule } from './search/search.module';
import { LoggerModule } from './logger';
import { CacheModule } from './cache/cache.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_DB_PASS: Joi.string().required(),
        POSTGRES_DB_USER: Joi.string().required(),
        POSTGRES_DB_NAME: Joi.string().required(),
        POSTGRES_DB_PORT: Joi.number().required(),
        POSTGRES_DB_HOST: Joi.string().required(),
        CACHE_TTL: Joi.number().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        ELASTIC_URL: Joi.string().required(),
        ELASTIC_USERNAME: Joi.string().required(),
        ELASTIC_PASSWORD: Joi.string().required(),
      }),
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: configService.get('POSTGRES_DB_PORT'),
        username: configService.get('POSTGRES_DB_USER'),
        password: configService.get('POSTGRES_DB_PASS'),
        database: configService.get('POSTGRES_DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    SearchModule,
    CacheModule,
  ],
  exports: [ConfigModule, SequelizeModule, SearchModule, CacheModule],
})
export class CoreModule {}
