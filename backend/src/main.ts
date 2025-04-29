import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
  );
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});
