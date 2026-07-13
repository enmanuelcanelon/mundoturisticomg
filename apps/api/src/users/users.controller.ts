import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, JwtPayloadUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('profile')
  profile(@CurrentUser() user: JwtPayloadUser) {
    return this.users.getProfile(user.id);
  }
}
