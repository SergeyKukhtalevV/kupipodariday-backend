import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../decorators/user.decorator';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtGuard)
  @Get('/me')
  getUserInfo(@AuthUser() user: User) {
    return this.usersService.findOneByIdOrUsername('username', user.username);
  }
  @UseGuards(JwtGuard)
  @Patch('/me')
  update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }
  @Get('/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.getUserInfo('username', username);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findUserInfo(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }
}
