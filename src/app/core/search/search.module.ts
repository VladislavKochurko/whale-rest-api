import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SequelizeModule } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';

import { SearchService } from './search.service';
import { Product } from '../../products/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const certificatePath = path.resolve(
          process.cwd(),
          './certs/ca/ca.crt',
        );
        try {
          const cert = await fs.promises.readFile(certificatePath);
          return {
            node: configService.get('ELASTIC_URL'),
            auth: {
              username: configService.get('ELASTIC_USERNAME'),
              password: configService.get('ELASTIC_PASSWORD'),
            },
            ssl: {
              ca: cert,
              rejectUnauthorized: false,
            },
          };
        } catch (err) {
          throw new InternalServerErrorException(
            err,
            `Can not find certificate on path ${certificatePath}`,
          );
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
