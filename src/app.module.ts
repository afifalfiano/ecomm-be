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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Categories, Products],
      synchronize: true,
      autoLoadEntities: true,
      migrationsTableName: 'migrations',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
