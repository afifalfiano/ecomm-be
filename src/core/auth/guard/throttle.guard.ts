import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerCustomGuard extends ThrottlerGuard {
  canActivate(context: ExecutionContext) {
    console.log('Throttler activated!');
    return super.canActivate(context);
  }
}
