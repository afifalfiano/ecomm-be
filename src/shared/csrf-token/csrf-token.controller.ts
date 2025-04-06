import { Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { doubleCsrfOptions } from 'src/config/csrfToken.config';
import { V1Controller } from 'src/core/auth/decorator/v1-controller.decorator';

@V1Controller('csrf-token')
export class CsrfTokenController {
  @Get()
  getCsrf(@Req() req: Request, @Res() res: Response) {
    const { generateToken } = doubleCsrf(doubleCsrfOptions);
    const token = generateToken(req, res, true, true);
    res.json({
      message: 'Generate CSRF Success',
      success: true,
      data: {
        csrfToken: token,
      },
    });
  }

  @Post('test')
  test(@Res() res: Response) {
    res.json({
      message: 'Test CSRF Success',
      success: true,
      data: null,
    });
  }
}
