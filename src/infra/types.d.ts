import { UUID } from '@carbonteq/hexapp';

export interface JwtPayload {
  id: UUID; // User ID
  email: string; // User's email
}

export interface DatabaseUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  pwHashed: string;
  isVerified: boolean;
}
