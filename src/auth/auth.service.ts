import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { SigningDto } from './dto/signingDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async signin(signingDto: SigningDto) {
    const user = await this.validatePassword(signingDto);
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
  async validatePassword(signingDto: SigningDto) {
    const user = await this.usersService.findOneByIdOrUsername(
      'username',
      signingDto.username,
    );
    if (!user || (await compare(signingDto.password, user.password))) {
      throw new NotFoundException(
        `Not found user with ${signingDto.username} or password`,
      );
    }
    const { password, ...result } = user;
    return result;
  }
}
