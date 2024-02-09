import { InternalServerErrorException } from '@nestjs/common';

export class ElasticSearchException extends InternalServerErrorException {
  constructor(error: Error) {
    super(error);
  }
}
