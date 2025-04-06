/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptors/response/response.interceptor';
import { GlobalExceptionFilter } from './core/exception/exception.filter';
import { Logger } from 'nestjs-pino';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import * as cookieParser from 'cookie-parser';
import { doubleCsrfOptions } from './config/csrfToken.config';
import { NextFunction } from 'express';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const {
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf(doubleCsrfOptions);
  app.use(cookieParser());
  // List of paths to exclude
  const excludedPaths = [
    '/v1/auth/login',
    '/v1/auth/register',
    '/v1/auth/logout',
    '/v1/upload',
    '/v1/payments/webhook/midtrans',
  ];

  const customCsrfProtection = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (excludedPaths.includes(req.path)) {
      return next(); // ✅ skip CSRF
    }

    return doubleCsrfProtection(req, res, next); // ✅ apply CSRF
  };
  app.use(customCsrfProtection);

  const config = new DocumentBuilder()
    .setTitle('E-Comm API')
    .setDescription('API documentation for the e-commerce system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
