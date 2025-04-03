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
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req) {
    return this.productService.create(req.body);
  }

  @Get()
  async list() {
    return this.productService.list();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productService.update(id, req.body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
