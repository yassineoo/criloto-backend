import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy ,ExtractJwt} from "passport-jwt";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access-token") {
   
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get<string>("JWT_ACCESS_TOKEN_SECRET")
        })
    }
    async validate( payload) {
        return {...payload}
    }

}