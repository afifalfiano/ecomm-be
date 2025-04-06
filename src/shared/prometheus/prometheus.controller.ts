import { V1Controller } from 'src/core/auth/decorator/v1-controller.decorator';
import { PrometheusService } from './prometheus.service';
import { Get, Res } from '@nestjs/common';
import { Response } from 'express';

@V1Controller('metrics')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.prometheusService.getMetrics();
    res.setHeader('Content-Type', 'text/plain');
    res.send(metrics);
  }
}
