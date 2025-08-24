// src/events/events.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './event.model';
import { Seat } from '../seats/seat.model'; // Import Seat model

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventRepository: typeof Event,
    @InjectModel(Seat) private seatRepository: typeof Seat, // Inject Seat model
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  // ✅ Return all events from DB
  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll(); // ✅ returns array
  }

  // ✅ Create a new event in DB
  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    const event = await this.eventRepository.create(eventData);

    // Automatically create seats for the new event
    const rows = 5; // Set your desired number of rows
    const cols = 8; // Set your desired number of columns
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
