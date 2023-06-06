import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Auth API for Task')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: configService.get('SECRET'),
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.get('PORT'));
}
bootstrap();
