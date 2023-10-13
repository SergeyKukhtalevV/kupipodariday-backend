import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../decorators/user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneByIdOrUsername('id', +id);
  }
  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByIdOrUsername('username', username);
  }
  @UseGuards(JwtGuard)
  @Patch('/me')
  update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  getUserInfo(@AuthUser() user: User) {
    return this.usersService.findOneByIdOrUsername('username', user.username);
  }
}
