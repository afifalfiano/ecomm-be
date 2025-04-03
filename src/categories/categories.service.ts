import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto copy';
import { ResponseAPI } from 'src/common/responses/response';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create({ name }: CreateCategoryDto): Promise<ResponseAPI<Categories>> {
    const exist = await this.categoriesRepository.findOne({ where: { name } });
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
  }

  async update(data: CreateCategoryDto) {}

  async delete(id: number) {
    try {
      await this.categoriesRepository.delete(id);
      return {
        message: 'Success delete category',
      };
    } catch (error: any) {
      throw new NotFoundException('Category not found');
    }
  }
}
