import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get(':eventId')
  async getSeats(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.seatsService.getSeatsForEvent(eventId);
  }

  @Post('book/:eventId')
  async bookSeats(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() body: { seats: { row: number; col: number }[] },
  ) {
    return this.seatsService.bookSeatsSimple(eventId, body.seats);
  }
  @UseGuards(AuthGuard)
  @Get('user-bookings')
  async getUserBookings(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.seatsService.getUserBookings(userId);
  }
}
