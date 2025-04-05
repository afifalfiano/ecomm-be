import { Test, TestingModule } from '@nestjs/testing';
import { R2objectController } from './r2object.controller';

describe('R2objectController', () => {
  let controller: R2objectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [R2objectController],
    }).compile();

    controller = module.get<R2objectController>(R2objectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
