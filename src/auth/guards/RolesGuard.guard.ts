import {Injectable , CanActivate, ExecutionContext, Inject, forwardRef, UnauthorizedException } from '@nestjs/common'
import {Reflector} from '@nestjs/core'

import { REQUIRED_ROLES_KEY } from '../decorators/requiredRoles.decorator';
import { JwtPayload } from '../types/JwtPayload.interface';
import { RequiredPermissions } from '../decorators/requiredPermissions.decorator';
import { UserRole } from 'src/users/types/userRole.enum';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RoleGuard implements CanActivate{
    constructor(
        @Inject(forwardRef(()=>UsersService)) private readonly userService:UsersService,
        private readonly reflector:Reflector
    ){}
     async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const user = <JwtPayload>request.user;
        const id = user.sub;
        const userDb =  await this.userService.findUserById(Number(id));
        if(!userDb){
            throw new UnauthorizedException();
        }
        const roles:string[] = this.reflector.getAllAndOverride(REQUIRED_ROLES_KEY,[context.getHandler(),context.getClass]);
        
        if(!roles) return true;
        console.log(userDb,roles,"........../////")
        const result =  roles.some(role =>  userDb.type.toLocaleLowerCase() === role.toLocaleLowerCase());
        if(!result) return false;
        if(userDb.type !== UserRole.MODERATOR) return true;
        //const moderatorPermissions:string[] = this.reflector.getAllAndOverride(RequiredPermissions,[context.getHandler(),context.getClass]);
       // return moderatorPermissions.every(rp=> userDb.moderatorsPermissions.some(p=>p.permission === rp.toLocaleLowerCase()))
    }
    
}