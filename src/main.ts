import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.get(ConfigService);

  const globalPrefix: string = configService.get('prefix') as string;

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // httep://localhost:3000/api/v1/test

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerHabilitado: boolean = configService.get(
    'swaggerHabilitado',
  ) as boolean;
  if (swaggerHabilitado) {
    const config = new DocumentBuilder()
      .setTitle('Encuestas')
      .setDescription('Descripcion de la API del sistema de encuestas')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }

  const port: number = configService.get<number>('port') as number;
  await app.listen(port);
  console.log(`Aplicacion corriendo en el puerto ${port}`);
}
bootstrap();
