import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { LoginDto } from 'src/app/dtos/login.dto';
import { AuthWorkflows } from 'src/app/workflows/auth-workflows';
import { Public } from 'src/web/filters/Decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly wfs: AuthWorkflows) {}

  @Public()
  @Post('/login')
  @HttpCode(200)
  async signIn(@Body() credentials: LoginDto) {
    return this.wfs.login(credentials);
  }

  @Public()
  @Post('/register')
  async signUp(@Body() body: unknown) {
    //Get DTO
    return 'Sign Up';
  }

  @Public()
  @Put('/reset-password')
  async resetPassword(@Body() body: unknown) {
    //Get DTO
    return 'Reset Password';
  }

  @Public()
  @Put('/forgot-password')
  async forgotPassword(@Body() body: unknown) {
    //Get DTO
    return 'Forgot Password';
  }

  @Public()
  @Put('/verify')
  async verifyUser(@Body() body: unknown) {
    //Get DTO
    return 'Verify';
  }
}
