import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser, JwtPayloadUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: JwtPayloadUser) {
    return this.bookings.listMine(user.id);
  }

  @Get(':id')
  getOne(@CurrentUser() user: JwtPayloadUser, @Param('id') id: string) {
    const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.AGENT;
    return this.bookings.getOne(user.id, id, isStaff);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.CUSTOMER)
  confirm(@CurrentUser() user: JwtPayloadUser, @Param('id') id: string) {
    const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.AGENT;
    return this.bookings.confirm(user.id, id, isStaff);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: JwtPayloadUser, @Param('id') id: string) {
    const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.AGENT;
    return this.bookings.cancel(user.id, id, isStaff);
  }
}
