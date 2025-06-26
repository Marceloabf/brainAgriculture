import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log("✅ MockJwtAuthGuard está sendo usado")

    const request = context.switchToHttp().getRequest()
    request.user = {
      id: "test-user-id",
      email: "test@example.com",
      role: "ADMIN",
    }

    return true
  }
}
