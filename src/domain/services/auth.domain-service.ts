import { Injectable } from '@nestjs/common';
import { ResetRequest } from '../entities/reset-requests/reset-request.entity';
import { User } from '../entities/user/user.entity';
import { VerifyRequest } from '../entities/verify-requests/verify-request.entity';
import { InvalidVerifyRequest } from '../entities/verify-requests/verify-request.errors';
import { InvalidResetRequest } from '../entities/reset-requests/reset-request.errors';

@Injectable()
export class AuthDomainService {
  verifyUser(verifyReq: VerifyRequest, user: User) {
    const isActive = verifyReq.markInactive();
    if (isActive) {
      const isExpired = verifyReq.guardAgainstExpiry();
      if (!isExpired) {
        user.setIsVerified();
        return;
      }
    }
    throw new InvalidVerifyRequest(verifyReq.id);
  }

  updatePassword(resetReq: ResetRequest, user: User, newPwHash: string) {
    const isActive = resetReq.markInactive();
    if (isActive) {
      const isExpired = resetReq.guardAgainstExpiry();
      if (!isExpired) {
        user.passwordUpdate(newPwHash);
        return;
      }
    }
    throw new InvalidResetRequest(resetReq.id);
  }
}
