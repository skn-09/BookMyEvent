import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './event.model';
import { SeatsService } from '../seats/seats.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventRepository: typeof Event,
    private readonly seatsService: SeatsService, // use seatsService here
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    const event = await this.eventRepository.create(eventData);
    await this.seatsService.bulkCreateSeatsForEvent(event.id);

    return event;
  }
}
