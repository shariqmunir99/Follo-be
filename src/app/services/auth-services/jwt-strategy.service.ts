import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from 'src/domain/entities/user/user.repository';
import { UserNotFound } from 'src/domain/entities/user/user.errors';
import { JwtPayload } from 'src/infra/types';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET, // Your JWT secret
    });
  }

  async validate(payload: JwtPayload) {
    // Use AuthService to find the user based on the payload
    const user = await this.userRepo.fetchById(payload.id);

    if (!user) {
      throw new UserNotFound(payload.id); // Throw if user not found
    }

    return user; // Return user object if found
  }
}
