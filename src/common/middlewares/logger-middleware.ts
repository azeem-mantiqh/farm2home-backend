import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) {}
  use(request: Request, response: Response, next: NextFunction): void {
    let ip = request.headers['x-forwarded-for'];
    const { method, originalUrl } = request;
    if (!ip) {
      ip = request.ip;
    }

    const userAgent = request.get('user-agent') || '';
    const dateLog = `${ip} ${dayjs(Date.now()).format('DD/MM/YYYY')}, ${dayjs(Date.now()).format('hh:mm:ss A')}${' '}`;
    const log = `${' '} ${method} ${originalUrl} ${userAgent}`;

    response.on('finish', () => {
      const { statusCode } = response;
      if (statusCode >= 200 && statusCode <= 299) {
        this.logger.info(dateLog + statusCode + log);
      } else if (statusCode === 304) {
        this.logger.debug(dateLog + statusCode + log);
      } else {
        if (method === 'POST' && request.body) {
          this.logger.error(`Request body: ${JSON.stringify(request.body)}`);
        }
        this.logger.error(dateLog + statusCode + log);
      }
    });
    next();
  }
}
