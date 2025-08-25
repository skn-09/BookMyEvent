import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './event.model';
import { Seat } from '../seats/seat.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventRepository: typeof Event,
    @InjectModel(Seat) private seatRepository: typeof Seat,
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    const event = await this.eventRepository.create(eventData);

    const rows = 10;
    const cols = 8;
    const seatsToCreate = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        seatsToCreate.push({
          eventId: event.id,
          row,
          col,
          isBooked: false,
        });
      }
    }

    await this.seatRepository.bulkCreate(seatsToCreate);

    return event;
  }
}
