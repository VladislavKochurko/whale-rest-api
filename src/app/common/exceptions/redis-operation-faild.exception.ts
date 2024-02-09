import { InternalServerErrorException } from '@nestjs/common';

export class RedisOperationFailedException extends InternalServerErrorException {
  constructor(error: Error) {
    super(error);
  }
}
