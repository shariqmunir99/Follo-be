import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/domain/enum';
import { ROLES_KEY } from '../Decorators/roles.decorator';
import { RoleRepository } from 'src/domain/entities/role/role.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesRepo: RoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let role;
    if (!requiredRoles) {
      return true;
    } else if (requiredRoles[0] === 0) {
      role = 'Organizer';
    } else role = 'User';

    console.log(requiredRoles);
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    const userRole = await this.rolesRepo.fetchById(user.roleID);
    if (userRole.roleName === role) {
      console.log('Shariq Munir');
      return true;
    } else return false;
  }
}
