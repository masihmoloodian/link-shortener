import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/shared/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Get user information by token' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  async getUserInfoById(@User() user) {
    return await this.userService.getUserInfoById(user.id);
  }

}
