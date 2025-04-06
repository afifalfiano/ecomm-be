import { Test, TestingModule } from '@nestjs/testing';
import { CsrfTokenController } from './csrf-token.controller';

describe('CsrfTokenController', () => {
  let controller: CsrfTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrfTokenController],
    }).compile();

    controller = module.get<CsrfTokenController>(CsrfTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
