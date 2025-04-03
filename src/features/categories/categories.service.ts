import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto copy';
import { ResponseAPI } from 'src/common/responses/response';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create({ name }: CreateCategoryDto): Promise<ResponseAPI<Categories>> {
    try {
      const exist = await this.categoriesRepository.findOneBy({ name });
      if (exist) {
        throw new ConflictException('Category already exist');
      }

      const newCategory = this.categoriesRepository.create({ name });
      const saveCategory = await this.categoriesRepository.save(newCategory);

      return {
        message: 'Category created successfully',
        data: saveCategory,
        success: true,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, data: UpdateCategoryDto): Promise<ResponseAPI<any>> {
    try {
      const exist = await this.categoriesRepository.findOneBy({ id: `${id}` });
      if (!exist) {
        throw new ConflictException('Category not found');
      }

      const checkOther = await this.categoriesRepository.find({
        where: { name: data.name },
      });
      if (checkOther.length > 0) {
        throw new ConflictException('Category name already exist');
      }

      const updateProduct = await this.categoriesRepository.update(id, data);

      if (updateProduct.affected === 0) {
        throw new HttpException(
          'Failed to update category',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Success update category',
        data: updateProduct,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to update category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<ResponseAPI<any>> {
    try {
      const exist = await this.categoriesRepository.findOneBy({ id: `${id}` });
      if (!exist) {
        throw new ConflictException('Category not found');
      }

      const data = await this.categoriesRepository.delete(id);
      return {
        success: true,
        message: 'Success delete category',
        data,
      };
    } catch (error: any) {
      throw new NotFoundException('Category not found');
    }
  }

  async list(): Promise<ResponseAPI<Categories[]>> {
    try {
      const data = await this.categoriesRepository.find({
        relations: ['products'],
      });
      return {
        success: true,
        data,
        message: 'Get Category successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get category list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
