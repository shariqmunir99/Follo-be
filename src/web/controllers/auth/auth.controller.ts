import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { query } from 'express';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyDto,
} from 'src/app/dtos/auth.dto';
import { AuthWorkflows } from 'src/app/workflows/auth.workflows';
import { Public } from 'src/web/filters/Decorators/public.decorator';

@Public()
@Controller('api/auth')
export class AuthController {
  constructor(private readonly wfs: AuthWorkflows) {}

  @Get()
  async test(@Query() query) {
    return this.wfs.test(query);
  }

  @Post('/login')
  @HttpCode(200)
  async signIn(@Body() credentials: LoginDto) {
    return this.wfs.login(credentials);
  }

  @Post('/register')
  async signUp(@Body() signupCredentials: SignUpDto) {
    return this.wfs.signUp(signupCredentials);
  }

  @Put('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.wfs.resetPassword(body);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.wfs.forgotPassword(body);
  }

  @Put('/verify')
  async verifyUser(@Body() verifyDTO: VerifyDto) {
    return this.wfs.verifyUser(verifyDTO);
  }
}
