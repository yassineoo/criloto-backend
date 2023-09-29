import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt'; // Import ExtractJwt

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Use ExtractJwt.fromExtractors
        (request: Request) => {
          const refreshToken = request?.cookies['refreshToken'];
          if (!refreshToken) {
            throw new UnauthorizedException(
              "Unauthorized, can't refresh token",
            );
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey:process.env.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  async validate(request, payload, next) {
    const refreshToken = request?.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException("Unauthorized, can't refresh token");
    }
    return { refreshToken, ...payload };
  }
}
