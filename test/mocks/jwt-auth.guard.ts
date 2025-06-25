import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; 
  }
}
