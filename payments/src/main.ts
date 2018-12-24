import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, config.microservicesConfiguration);
  await app.listenAsync();
}
bootstrap();
