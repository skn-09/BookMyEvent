import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Delete,
  Body,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
      throw new Error('User ID not found in token'); // <-- your error
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
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    const seatsWithUser = body.seats.map((seat) => ({ ...seat, userId }));
    return this.seatsService.bookSeatsSimple(eventId, seatsWithUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:eventId')
  async cancelBooking(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    if (!userId) throw new Error('User ID not found in token');
    return this.seatsService.cancelBooking(eventId, userId);
  }
}
