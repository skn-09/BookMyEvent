import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.model';
import { SeatsService } from '../seats/seats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly seatsService: SeatsService,
  ) {}

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Post()
  async createEvent(@Body() eventData: Omit<Event, 'id'>): Promise<Event> {
    return this.eventsService.createEvent(eventData);
  }

  @Get(':id/seats')
  async getSeats(@Param('id') eventId: number) {
    return this.seatsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/book-seats')
  async bookSeats(
    @Param('id') eventId: number,
    @Body('seats') seats: { row: number; col: number }[],
    @Req() req: Request,
  ) {
    const userId =
      (req as any).user?.id ||
      (req as any).user?.sub ||
      (req as any).user?.userId;
    const seatsWithUser = seats.map((seat) => ({ ...seat, userId }));
    return this.seatsService.bookSeatsSimple(eventId, seatsWithUser);
  }

  // New endpoint to get user bookings
  @Get('user/:userId/bookings')
  async getUserBookings(@Param('userId') userId: number) {
    return this.seatsService.getUserBookings(userId);
  }
}
