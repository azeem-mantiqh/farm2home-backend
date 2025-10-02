import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlInjectionPreventionMiddleware } from './common/middlewares/sql-prevention.middleware';
import { SecretsModule } from './common/secrets/secrets.module';
import { LoggerMiddleware } from './common/middlewares/logger-middleware';
import config from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config()), SecretsModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(SqlInjectionPreventionMiddleware).forRoutes('*');
  }
}
