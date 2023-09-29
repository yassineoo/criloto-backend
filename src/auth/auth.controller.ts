import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetCurrentUserId } from './decorators/getCurrentUserId.decorator';
import { RequiredRoles } from './decorators/requiredRoles.decorator';
import { AuthDTO } from './dtos/auth.dto';
import { OtpVerificationDTO } from './dtos/otpVerification.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { RoleGuard } from './guards/RolesGuard.guard';
import { LoginAdminDto } from './dtos/login-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  async signin(@Body() authDto: AuthDTO) {
    return await this.authService.signin();
  }
  /*
  @Post('verify-phone-number')
  async verifyOtpSignin(
    @Body() token: OtpVerificationDTO,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    const result = await this.authService.verifyOtp(token);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      maxAge: new Date(+process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
      sameSite: 'none',
      secure: true,
    });
    return {
      accessToken: result.tokens.accessToken,
      notification: result.notification,
    };
  }
*/


  @Post('free-tokens/:userId')
  @ApiParam({ name: 'userId', required: true })
  async freeTokens(@Param('userId') userId: string) {
    return await this.authService.freeToken(parseInt(userId));
  }

  @ApiBearerAuth()
  @Post('login/admin')
  async loginAdmin(
    @Body() data: LoginAdminDto,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    const tokens = await this.authService.loginAdmin(data);

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: new Date(+process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
      sameSite: 'none',
      secure: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('logout')
  async logout(@GetCurrentUserId() id: string) {
    return await this.authService.logout(id);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh_token')
  async refresh_token(@Req() request, @Res({ passthrough: true }) res) {
    const refresh_token = request.user.refreshToken;
    const userId = request.user.sub;
    const tokens = await this.authService.refresh_token(userId, refresh_token);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: new Date(+process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
      sameSite: false,
      secure: false,
    });

    return { accessToken: tokens.accessToken };
  }
}
