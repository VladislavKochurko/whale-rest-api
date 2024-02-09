import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

import { RedisOperationFailedException } from '../../common';

@Catch(HttpException)
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Skipping RedisOperationFailedException error as cache failure is non-critical,
    // and we proceed with request handling, providing data to the user regardless.
    if (exception instanceof RedisOperationFailedException) {
      this.logger.error(exception.message);
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    });
  }
}
