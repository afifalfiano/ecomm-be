import { Test, TestingModule } from '@nestjs/testing';
import { R2ObjectService } from './r2-object.service';

describe('R2ObjectService', () => {
  let service: R2ObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [R2ObjectService],
    }).compile();

    service = module.get<R2ObjectService>(R2ObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
