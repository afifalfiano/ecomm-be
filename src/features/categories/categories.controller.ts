import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';
import { V1Controller } from 'src/core/auth/decorator/v1-controller.decorator';

@V1Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req) {
    return this.categoriesService.create(req.body);
  }

  @Get()
  async list() {
    return this.categoriesService.list();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.categoriesService.update(id, req.body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
