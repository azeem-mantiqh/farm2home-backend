import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lint Check
  // Security middleware
  app.use(cookieParser());
  app.use(
    compression({
      level: 6,
      threshold: '1kb',
      filter: (req) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return true;
      },
    }),
  );

  // ! remove v1 from global prefix so when
  // ! we use versioning apis can automatically take v1, v2 etc
  // app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'prod',
    }),
  );

  // Swagger documentation
  if (process.env.NODE_ENV !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(process.env.SERVER_PORT || 8080);
  Logger.debug(`Server running on port ${process.env.SERVER_PORT || 8080}`);
}
bootstrap();
