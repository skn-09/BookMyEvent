import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seat, SeatAttributes } from './seat.model';
import { Event } from '../events/event.model';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat)
    private seatModel: typeof Seat,
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  // 🔹 Bulk create seats when new event is created
  async bulkCreateSeatsForEvent(eventId: number) {
    const rows = 10;
    const cols = 8;
    const seatsToCreate = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        seatsToCreate.push({
          eventId,
          row,
          col,
          isBooked: false,
        });
      }
    }

    await this.seatModel.bulkCreate(seatsToCreate);
  }

  // Get all seats for an event
  async getSeatsForEvent(eventId: number): Promise<Seat[]> {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');
    return this.seatModel.findAll({ where: { eventId } });
  }

  // Find seats by event
  async findByEvent(eventId: number) {
    return this.seatModel.findAll({ where: { eventId } });
  }

  // Book seats for an event
  async bookSeatsSimple(
    eventId: number,
    seats: { row: number; col: number; userId?: number }[],
  ) {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');

    const requestedPairs = seats.map((s) => ({ row: s.row, col: s.col }));

    const existingSeats = await this.seatModel.findAll({ where: { eventId } });

    const existingMap = new Map<string, Seat>();
    existingSeats.forEach((s) => existingMap.set(`${s.row}:${s.col}`, s));

    const alreadyBooked: string[] = [];
    for (const s of requestedPairs) {
      const key = `${s.row}:${s.col}`;
      const existing = existingMap.get(key);
      if (existing && existing.isBooked) {
        alreadyBooked.push(`${s.row}-${s.col}`);
      }
    }

    if (alreadyBooked.length) {
      throw new ConflictException(
        `Seats already booked: ${alreadyBooked.join(', ')}`,
      );
    }

    const updatedSeats: Seat[] = [];
    for (const s of requestedPairs) {
      const key = `${s.row}:${s.col}`;
      const existing = existingMap.get(key);
      if (existing) {
        existing.isBooked = true;
        if (
          seats.find((seat) => seat.row === s.row && seat.col === s.col)?.userId
        ) {
          existing.userId = seats.find(
            (seat) => seat.row === s.row && seat.col === s.col,
          )?.userId!;
        }
        await existing.save();
        updatedSeats.push(existing);
      } else {
        const newSeat: SeatAttributes = {
          eventId,
          row: s.row,
          col: s.col,
          isBooked: true,
          userId: seats.find((seat) => seat.row === s.row && seat.col === s.col)
            ?.userId,
        };
        const created = await this.seatModel.create(newSeat as any);
        updatedSeats.push(created);
      }
    }

    return {
      message: 'Seats booked successfully',
      booked: updatedSeats.map((s) => ({
        row: s.row,
        col: s.col,
        userId: s.userId,
      })),
    };
  }

  // Simple book seats without user
  async bookSeats(eventId: number, seats: { row: number; col: number }[]) {
    for (const seat of seats) {
      await this.seatModel.update(
        { isBooked: true },
        { where: { eventId, row: seat.row, col: seat.col } },
      );
    }
    return { success: true };
  }

  // Get user bookings
  async getUserBookings(userId: number) {
    const bookedSeats = await this.seatModel.findAll({
      where: { userId, isBooked: true },
      include: [Event],
    });

    const bookingsByEvent: Record<
      number,
      { eventName: string; eventPrice: number; seats: string[] }
    > = {};

    bookedSeats.forEach((seat) => {
      const eventId = seat.eventId;
      let eventName = 'Unknown Event';
      let eventPrice = 0;
      if (seat.event) {
        eventName = seat.event.title || 'Unknown Event';
        eventPrice = seat.event.price || 0;
      }
      if (!bookingsByEvent[eventId]) {
        bookingsByEvent[eventId] = {
          eventName,
          eventPrice,
          seats: [],
        };
      }
      // Convert row number to letter (0 -> A, 1 -> B, etc.)
      const rowLetter = String.fromCharCode(65 + seat.row - 1);
      bookingsByEvent[eventId].seats.push(`${rowLetter}${seat.col}`);
    });

    const result = Object.values(bookingsByEvent).map((b) => ({
      eventName: b.eventName,
      price: b.eventPrice,
      bookedSeats: b.seats.join(', '),
      totalSeats: b.seats.length,
    }));

    return { totalBookings: result.length, bookings: result };
  }
}
