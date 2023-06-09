import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  // ************************OAuthGoogle****************************

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiTags('google/login')
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiTags('google/redirect')
  handleRedirect() {
    return { msg: 'OK Google' };
  }
  // ************************OAuthFacebook****************************
  // http://localhost:3001/api/auth/facebook/login
  @ApiTags('facebook/login')
  @Get('facebook/login')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return { msg: 'Facebook Authentication' };
  }

  @Get('/facebook/redirect')
  @ApiTags('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      msg: 'OK Facebook',
      data: req,
    };
  }

  // ******************************JWT Authentication****************************
  @Post('Signup with email')
  @ApiTags('signup')
  @ApiOkResponse({ description: 'signUp was successfully' })
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('login')
  @ApiTags('Login with email')
  @ApiOkResponse({ description: 'login was successfully' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('reset')
  @ApiTags('reset')
  @ApiOkResponse({ description: 'resetPassword was successfully' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiTags('ResetPassword with email')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ token: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
