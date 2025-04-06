import { Module } from '@nestjs/common';
import { R2ObjectService } from './r2-object/r2-object.service';
import { R2ObjectController } from './r2-object/r2object.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrometheusController } from './prometheus/prometheus.controller';
import { PrometheusService } from './prometheus/prometheus.service';
import { CsrfTokenController } from './csrf-token/csrf-token.controller';

@Module({
  providers: [R2ObjectService, PrometheusService],
  exports: [R2ObjectService, PrometheusService],
  imports: [MulterModule.register()],
  controllers: [R2ObjectController, PrometheusController, CsrfTokenController],
})
export class SharedModule {}
