import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Generate a JWT token
  generateToken(userId: string): string {
    const payload = { userId };
    return this.jwtService.sign(payload); // This will generate a JWT
  }

  // Verify a JWT token
  verifyToken(token: string): any {
    return this.jwtService.verify(token); // This will verify the JWT
  }
}
