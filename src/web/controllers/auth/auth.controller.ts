import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyDto,
} from 'src/app/dtos/auth.dto';
import { AuthWorkflows } from 'src/app/workflows/auth-workflows';
import { Role } from 'src/domain/enum';
import { Public } from 'src/web/filters/Decorators/public.decorator';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly wfs: AuthWorkflows) {}

  @Public()
  @Get('/test')
  async demo() {
    return this.wfs.demoSignIn();
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async signIn(@Body() credentials: LoginDto) {
    return this.wfs.login(credentials);
  }

  @Public()
  @Post('/register')
  async signUp(@Body() signupCredentials: SignUpDto) {
    //Get DTO
    return this.wfs.signUp(signupCredentials);
  }

  @Public()
  @Put('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    //Get DTO
    return this.wfs.resetPassword(body);
  }

  @Public()
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    //Get DTO
    return this.wfs.forgotPassword(body);
  }

  @Public()
  @Put('/verify')
  async verifyUser(@Body() verifyDTO: VerifyDto) {
    //Get DTO
    return this.wfs.verifyUser(verifyDTO);
  }
}
