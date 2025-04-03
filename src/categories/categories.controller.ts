import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req) {
    return this.categoriesService.create(req.body);
  }
}
