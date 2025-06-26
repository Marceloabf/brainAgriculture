import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MockRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log("✅ MockRolesGuard está sendo usado")
    return true
  }
}
