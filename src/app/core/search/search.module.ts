import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';

import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const certificatePath = path.resolve(process.cwd(), 'http_ca.crt');
        try {
          const cert = await fs.promises.readFile(certificatePath);
          return {
            node: configService.get('ELASTIC_URL'),
            auth: {
              username: configService.get('ELASTIC_USERNAME'),
              password: configService.get('ELASTIC_PASSWORD'),
            },
            tls: {
              ca: cert,
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
