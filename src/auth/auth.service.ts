import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { SigningDto } from './dto/signingDto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  auth(user: User) {

  }
  async validatePassword(signingDto: SigningDto) {
    const user = await this.usersService.findOneByIdOrUsername(
      'username',
      signingDto.username,
    );
    if (!user) {
      throw new NotFoundException(
        `Not found user with ${signingDto.username} or password`,
      );
    }

    if (await compare(signingDto.password, user.password)) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
