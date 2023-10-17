import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { JwtAccessTokenStrategy } from './passport-strategies/jwt-access-token-strategy';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { JwtRefreshTokenStrategy } from './passport-strategies/jwt-refresh-token-strategy';
import { RoleGuard } from './guards/RolesGuard.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    AuthService,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    RoleGuard,
  ],
  exports: [
    AuthService,
    RoleGuard,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
