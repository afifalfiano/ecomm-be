import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entity/categories.entity';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Categories])],
})
export class CategoriesModule {}
