import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseAPI } from 'src/common/responses/response';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create(payload: CreateProductDto): Promise<ResponseAPI<Products>> {
    try {
      const { name } = payload;
      const exist = await this.productsRepository.findOne({ where: { name } });
      if (exist) {
        throw new ConflictException('Product already exist');
      }

      const newProduct = this.productsRepository.create(payload);
      const saveProduct = await this.productsRepository.save(newProduct);

      return {
        message: 'Product created successfully',
        data: saveProduct,
        success: true,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, data: UpdateProductDto): Promise<ResponseAPI<any>> {
    try {
      const exist = await this.productsRepository.findOneBy({ id: `${id}` });
      if (!exist) {
        throw new ConflictException('Product not found');
      }

      const checkOther = await this.productsRepository.find({
        where: { name: data.name },
      });
      if (checkOther.length > 0) {
        throw new ConflictException('Product name already exist');
      }

      const updateProduct = await this.productsRepository.update(id, data);

      if (updateProduct.affected === 0) {
        throw new HttpException(
          'Failed to update product',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Success update product',
        data: updateProduct,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<ResponseAPI<any>> {
    try {
      const exist = await this.productsRepository.findOneBy({ id: `${id}` });
      if (!exist) {
        throw new ConflictException('Product not found');
      }

      const data = await this.productsRepository.softDelete(id);
      return {
        success: true,
        message: 'Success delete product',
        data,
      };
    } catch (error: any) {
      throw new NotFoundException('Product not found');
    }
  }

  async list(): Promise<ResponseAPI<Products[]>> {
    try {
      const data = await this.productsRepository.find({
        relations: ['category'],
      });
      return {
        success: true,
        data,
        message: 'Get Products successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get product list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
