import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';

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
        CACHE_TTL: Joi.number().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
      }),
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: +configService.get('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: 'localhost',
        port: configService.get('POSTGRES_DB_PORT'),
        username: configService.get('POSTGRES_DB_USER'),
        password: configService.get('POSTGRES_DB_PASS'),
        database: configService.get('POSTGRES_DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, CacheModule, SequelizeModule],
})
export class CoreModule {}
