import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; 
  }
}
