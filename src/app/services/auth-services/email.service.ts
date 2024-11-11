import { Injectable, Provider } from '@nestjs/common';
import emailjs from '@emailjs/nodejs';

interface Payload {
  user_email: string;
  user_name: string;
  href: string;
}

abstract class MailService {
  abstract sendVerifyEmail(payload: Payload);
  abstract sendResetPasswordEmail(payload: Payload);
}

@Injectable()
export class EmailJSMailService implements MailService {
  constructor() {
    emailjs.init({
      publicKey: process.env.EMAIL_SERVICE_PUBLIC_KEY,
      privateKey: process.env.EMAIL_SERVICE_PRIVATE_KEY,
    });
  }
  async sendVerifyEmail(payload: Payload) {
    const templateParams = {
      ...payload,
      subject: 'Verify your account',
      message: 'Welcome to Follo. Click the button to verify your account',
      button: 'Verify your account',
    };

    try {
      const response = await emailjs.send(
        'default_service',
        'auth_temp',
        templateParams,
      );
      console.log('SUCCESS', response.status, response.text);
    } catch (err) {
      console.log('FAILED...', err);
    }
  }

  async sendResetPasswordEmail(payload: Payload) {
    const templateParams = {
      ...payload,
      subject: 'Reset your password',
      message:
        'Click the button to Reset your account. If this request was not initiated by you then please ignore.',
      button: 'Reset Password',
    };

    try {
      const response = await emailjs.send(
        'default_service',
        'auth_temp',
        templateParams,
      );
      console.log('SUCCESS', response.status, response.text);
    } catch (err) {
      console.log('FAILED...', err);
    }
  }
}

export const EmailServiceProvider: Provider<MailService> = {
  provide: EmailJSMailService,
  useClass: EmailJSMailService,
};
