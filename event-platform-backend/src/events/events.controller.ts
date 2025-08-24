// src/events/events.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { Event } from './event.model';
import { SeatsService } from '../seats/seats.service';

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

  @Post(':id/book-seats')
  async bookSeats(
    @Param('id') eventId: number,
    @Body('seats') seats: { row: number; col: number }[],
  ) {
    return this.seatsService.bookSeatsSimple(eventId, seats);
  }
}
