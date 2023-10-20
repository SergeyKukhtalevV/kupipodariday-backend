import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SigningDto } from './dto/signingDto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signin(@Body() signingDto: SigningDto) {
    return this.authService.signin(signingDto);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.signup(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, password, ...otherInfo } = user;
    return await this.authService.signin({ username, password });
  }
}
