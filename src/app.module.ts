import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { User } from './features/users/entity/user.entity';
import { CategoriesModule } from './features/categories/categories.module';
import { Categories } from './features/categories/entity/categories.entity';
import { ProductsModule } from './features/products/products.module';
import { Products } from './features/products/entity/products.entity';
import { LoggerModule } from 'nestjs-pino';
import { OrderItems } from './features/order-items/entity/order-items.entity';
import { Orders } from './features/orders/entity/orders.entity';
import { OrdersModule } from './features/orders/orders.module';
import { OrderItemsModule } from './features/order-items/order-items.module';
import { Payments } from './features/payments/entity/payments';
import { PaymentsModule } from './features/payments/payments.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Categories, Products, OrderItems, Orders, Payments],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      logger: 'advanced-console',
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // max 10 request per 60s
          limit: 10,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrderItemsModule,
    OrdersModule,
    PaymentsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
