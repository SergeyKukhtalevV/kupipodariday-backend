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
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  getUserInfo(@AuthUser() user: User) {
    return this.usersService.getInfoAboutMe(user.username);
  }

  @Get('/me/wishes')
  getMyWishes(@AuthUser() user: User) {
    return this.usersService.getUserWishes(user.username);
  }

  @Get(':username/wishes')
  getUserWishes(@AuthUser() user: User) {
    return this.usersService.getUserWishes(user.username);
  }

  @Patch('/me')
  update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  findOneByUsername(@Param('username') username: string) {
    return this.usersService.getUserInfo('username', username);
  }

  @Post('/find')
  findUserInfo(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }
}
