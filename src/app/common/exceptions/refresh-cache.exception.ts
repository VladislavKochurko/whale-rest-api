import { InternalServerErrorException } from '@nestjs/common';

export class RefreshCacheException extends InternalServerErrorException {
  constructor(error: Error) {
    super(error);
  }
}