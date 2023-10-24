import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SigningDto } from './dto/signingDto';
import { UserProfileResponseDto } from '../users/dto/responce/user-profile-response.dto';
import { BcryptService } from '../common/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}
  async signin(signingDto: SigningDto) {
    const user = await this.validatePassword(signingDto);
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
  async validatePassword(
    signingDto: SigningDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOneByIdOrUsername(
      'username',
      signingDto.username,
    );
    const isAuth = await this.bcryptService.comparePasswords(
      signingDto.password,
      user.password,
    );
    if (!isAuth) {
      throw new NotFoundException(
        `Not found user with ${signingDto.username} or password`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
