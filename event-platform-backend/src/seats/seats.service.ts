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

  async getSeatsForEvent(eventId: number): Promise<Seat[]> {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');
    return this.seatModel.findAll({ where: { eventId } });
  }

  async bookSeatsSimple(
    eventId: number,
    seats: { row: number; col: number; userId?: number }[],
  ) {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');

    const existingSeats = await this.seatModel.findAll({ where: { eventId } });
    const existingMap = new Map<string, Seat>();
    existingSeats.forEach((s) => existingMap.set(`${s.row}:${s.col}`, s));

    const updatedSeats: Seat[] = [];
    for (const s of seats) {
      const key = `${s.row}:${s.col}`;
      const existing = existingMap.get(key);
      if (existing) {
        if (existing.isBooked)
          throw new ConflictException(`Seat ${s.row}-${s.col} already booked`);
        existing.isBooked = true;
        existing.userId = s.userId!;
        await existing.save();
        updatedSeats.push(existing);
      } else {
        const newSeat: SeatAttributes = {
          eventId,
          row: s.row,
          col: s.col,
          isBooked: true,
          userId: s.userId,
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
      if (!bookingsByEvent[eventId]) {
        bookingsByEvent[eventId] = {
          eventName: seat.event?.title || 'Unknown Event',
          eventPrice: seat.event?.price || 0,
          seats: [],
        };
      }
      const rowLetter = String.fromCharCode(65 + seat.row - 1);
      bookingsByEvent[eventId].seats.push(`${rowLetter}${seat.col}`);
    });

    const result = Object.entries(bookingsByEvent).map(([eventId, b]) => ({
      eventId: Number(eventId), // ✅ include eventId for frontend
      eventName: b.eventName,
      price: b.eventPrice,
      bookedSeats: b.seats.join(', '),
      totalSeats: b.seats.length,
      totalPrice: b.eventPrice * b.seats.length,
    }));

    return { totalBookings: result.length, bookings: result };
  }

  async cancelBooking(eventId: number, userId: number) {
    const bookedSeats = await this.seatModel.findAll({
      where: { eventId, userId, isBooked: true },
    });

    if (!bookedSeats.length)
      throw new NotFoundException('No booking found for this event');

    for (const seat of bookedSeats) {
      seat.isBooked = false;
      seat.userId = null;
      await seat.save();
    }

    return {
      message: 'Booking cancelled successfully',
      eventId,
      releasedSeats: bookedSeats.map((s) => ({ row: s.row, col: s.col })),
    };
  }
}
