import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, JwtModule, UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
