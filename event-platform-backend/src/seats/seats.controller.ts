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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { Request } from 'express';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user-bookings')
  async getUserBookings(@Req() req: Request) {
    const userId =
      (req as any).user?.id ||
      (req as any).user?.sub ||
      (req as any).user?.userId;
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    return this.seatsService.getUserBookings(userId);
  }

  @Get(':eventId')
  async getSeats(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.seatsService.getSeatsForEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('book/:eventId')
  async bookSeats(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() body: { seats: { row: number; col: number }[] },
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    // Attach userId to each seat
    const seatsWithUser = body.seats.map((seat) => ({ ...seat, userId }));
    return this.seatsService.bookSeatsSimple(eventId, seatsWithUser);
  }
}
