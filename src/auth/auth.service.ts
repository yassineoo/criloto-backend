import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AddAdminDto } from 'src/users/dto/create-admin.dto';
import { LoginDto } from './dtos/login-admin.dto';
import { OtpVerificationDTO } from './dtos/otpVerification.dto';
import { JwtPayload } from './types/JwtPayload.interface';
import { Tokens } from './types/Tokens.interface';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    //private readonly twilioService: TwilioService,
    private readonly jwtService: JwtService,
  ) {}

  async comparePassword(hash: string, password: string) {
    return bcrypt.compare(password, hash);
  }
  async hashpassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async signin(/*{ phoneNumber }: AuthDTO*/) {
    //  return this.#sendVerificationCodeTo(phoneNumber);
  }

  async addAdmin(data: AddAdminDto) {
    data.password = await this.hashpassword(data.password);
    return this.userService.addAdmin(data);
  }

  async login({ password, email }: LoginDto) {
    // const adminUser = await this.userService.getUserByPhoneNumber(phoneNumber);
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('user not found');
    const match = await this.comparePassword(user.password, password);
    if (!match) throw new UnauthorizedException('wrong credentials');

    const tokens = await this.#generateTokens({
      email,
      sub: user.id,
    });
    await this.#updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  /*
  async verifyOtp({ otp, phoneNumber, referrerId }: OtpVerificationDTO) {
    // await this.twilioService.verifyPhoneNumber(phoneNumber, otp);
  
    let userDb = await this.userService.getUserByPhoneNumber(phoneNumber);
    let notification = 'nothing';
    let isNew = false;
    if (!userDb) {
      userDb = await this.userService.createUser(phoneNumber);
      isNew = true;
    } else {
      let subsDb = userDb.subscriptions[0];

      userDb.phoneNumber = phoneNumber;
      if (
        (userDb.type == UserRole.ORGANIZER || userDb.type == UserRole.SELLER) &&
        subsDb
      ) {
        if (
          subsDb?.plan?.type == PartenerPlanType.SUBSCRIPTION ||
          subsDb?.plan?.permissions?.find(
            (p) => p.name === PlanPermissionType.SUBSCRIPTION,
          )
        ) {
          const currentDate = new Date();
          const endDate = new Date(subsDb.endDate);

          if (endDate < currentDate) {
            subsDb.status = SubscriptionStatus.EXPIRED;
            notification = 'your subscription has been exipred';
            if (userDb.type == UserRole.SELLER) {
              const count = await this.productService.getProductCount(
                userDb.id,
              );

              if (count > 30) {
                this.productService.limiteAccess(userDb.id);
              }
            }
          }
          await this.userService.downgradeSubscription(userDb);
          await this.userService.updateSubscription(subsDb);
        }
      }

      userDb = await this.userService.updateUser(userDb);
    }
    // Set the referrerId if it is provided (i.e., user signed up using an invitation link)
    if (referrerId) {
      const referrer = await this.userService.findUserById(referrerId);
      if (!referrer) throw new NotFoundException('referrer not found');
      referrer.points += 200;
      userDb.referrerId = referrerId;
      await this.userService.updateUser(referrer); // Update the referrer with the points
      await this.userService.updateUser(userDb); // Update the user with the referrerId
    }

    if (userDb.status === ClientStatus.BANNED)
      throw new UnauthorizedException('Account banned');
    const tokens = await this.#generateTokens({
      phoneNumber,
      sub: userDb.id,
    });
    await this.#updateRefreshTokenHash(userDb.id, tokens.refreshToken);
    return { tokens, notification };
  }
  */

  async refresh_token(id: number, refresh_token: string) {
    try {
      const userDb = await this.userService.findUserById(id);
      if (!userDb || !userDb?.refreshToken) {
        throw new ForbiddenException('user deleted or loged out');
      }

      const equal = await bcrypt.compare(refresh_token, userDb.refreshToken);

      if (!equal) {
        throw new ForbiddenException('old token');
      }

      const tokens = await this.#generateTokens({
        email: userDb.phoneNumber,
        sub: userDb.id,
      });
      await this.#updateRefreshTokenHash(
        Number(userDb.id),
        tokens.refreshToken,
      );

      return tokens;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async logout(userId: string) {
    return await this.userService.updateRefreshToken(Number(userId), null);
  }
  //private methods------------------------------------------------------------------------------------
  async #sendVerificationCodeTo(phoneNumber: string) {
    try {
      //  await this.twilioService.initPhoneNumberVerification(phoneNumber);
      return {
        message: `a message containing the verification code is sent into ${phoneNumber}`,
      };
    } catch (err) {
      Logger.log(err);
      throw new InternalServerErrorException(
        `could not send the message to ${phoneNumber}`,
      );
    }
  }
  async #generateTokens(payload: JwtPayload): Promise<Tokens> {
    Logger.log('generateTokens', payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async #updateRefreshTokenHash(
    userId: number,
    refresh_token: string,
  ): Promise<void> {
    const refresh_token_hash = await bcrypt.hash(refresh_token, 12);
    await this.userService.updateRefreshToken(
      Number(userId),
      refresh_token_hash,
    );
  }
  async freeToken(userId: number) {
    const user = await this.userService.findUserById(Number(userId));
    return this.#generateTokens({ sub: userId, email: user.email });
  }

  extractUserIdFromAccessToken(accessToken: string): string | null {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });

      if (payload && payload.sub) {
        return payload.sub; // Assuming 'sub' contains the user's ID
      }
    } catch (error) {
      console.log(error);

      // Handle invalid or expired tokens
    }
    return null;
  }
}
