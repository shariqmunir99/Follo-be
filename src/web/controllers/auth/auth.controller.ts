import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { AuthWorkflows } from 'src/app/workflows/auth-workflows';

@Controller('auth')
export class AuthController {
  constructor(private readonly wfs: AuthWorkflows) {}

  @Post('/login')
  @HttpCode(200)
  async signIn(@Body() body: unknown) {
    //Get DTO

    return this.wfs.login();
  }

  @Post('/register')
  async signUp(@Body() body: unknown) {
    //Get DTO
    return 'Sign Up';
  }

  @Put('/reset-password')
  async resetPassword(@Body() body: unknown) {
    //Get DTO
    return 'Reset Password';
  }

  @Put('/forgot-password')
  async forgotPassword(@Body() body: unknown) {
    //Get DTO
    return 'Forgot Password';
  }

  @Put('/verify')
  async verifyUser(@Body() body: unknown) {
    //Get DTO
    return 'Verify';
  }
}
