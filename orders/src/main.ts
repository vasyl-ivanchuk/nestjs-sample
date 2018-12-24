import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(config.microservicesConfiguration);

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
