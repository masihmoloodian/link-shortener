import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { User } from 'src/shared/user.decorator';
import { JwtGuard } from './guard/jwt.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signUp')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signIn')
  async signIn(@Body() dto: SignInDto) {

    return this.authService.signIn(dto);
  }

  @ApiOperation({ summary: 'Get OTP code' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('otp')
  async getOTPcode(@User() user) {
    return await this.authService.getOTPcode(user.id);
  }

  @ApiOperation({ summary: 'Validate OTP code' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('otp/validate/:code')
  async validateOtp(@User() user, @Param('code') code: number) {
    return await this.authService.validateOTPcode(user.id, code);
  }

}
