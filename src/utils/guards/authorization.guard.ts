import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

export const authorizeGuard = (allowedRoles: string[]) => {
  class AuthorizationGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request?.currentUser?.roles.map((role: string) => allowedRoles.includes(role))
          .find((role: boolean) => role === true);
      if (user) return true;
      throw new Error('Unauthorized!');
    }
  }
  const guard = mixin(AuthorizationGuardMixin);
  return guard;
}
