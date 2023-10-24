import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../decorators/user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }
  @Get('/last')
  getLastWish() {
    return this.wishesService.getWishesBy('createdAt', 'DESC', 40);
  }
  @Get('/top')
  getTopWish() {
    return this.wishesService.getWishesBy('copied', 'ASC', 20);
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(user, +id, updateWishDto);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishesService.remove(user, +id);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishesService.copyWishById(user, +id);
  }
}
