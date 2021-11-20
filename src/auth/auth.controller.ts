import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'User sign out by username and password + phonenumber: Use for OTP' })
  @Post('/signUp')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'User sign in by username and password' })
  @Post('signIn')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @ApiOperation({ summary: 'Get OTP code, valide for 90 seconds' })
  @Get('otp/:phonenumber')
  async getOTPcode(@Param('phonenumber') phonenumber: string): Promise<number> {
    return await this.authService.getOTPcode(phonenumber);
  }

}
