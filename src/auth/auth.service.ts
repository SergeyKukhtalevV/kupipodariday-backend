import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async validatePassword(signinDto: SigninDto) {
    const user = await this.usersService.findOneByIdOrUsername(
      'username',
      signinDto.username,
    );
    if (!user) {
      throw new NotFoundException(
        `Not found user with ${signinDto.username} or password`,
      );
    }

    if (await compare(signinDto.password, user.password)) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
