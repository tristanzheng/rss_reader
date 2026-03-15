import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.WORKER_DISABLED = '0';
  process.env.REDIS_DISABLED = '0';

  const app = await NestFactory.createApplicationContext(AppModule);

  const shutdown = async () => {
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });

  process.on('SIGTERM', () => {
    void shutdown();
  });
}

void bootstrap();
