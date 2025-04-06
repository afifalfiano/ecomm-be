import { Module } from '@nestjs/common';
import { R2ObjectService } from './r2-object/r2-object.service';
import { R2ObjectController } from './r2-object/r2object.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [R2ObjectService],
  exports: [R2ObjectService],
  imports: [MulterModule.register()],
  controllers: [R2ObjectController],
})
export class SharedModule {}
