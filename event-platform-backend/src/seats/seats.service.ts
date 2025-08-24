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

  async getSeatsForEvent(eventId: number): Promise<Seat[]> {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');
    return this.seatModel.findAll({ where: { eventId } });
  }

  async findByEvent(eventId: number) {
    return this.seatModel.findAll({ where: { eventId } });
  }

  async bookSeatsSimple(
    eventId: number,
    seats: { row: number; col: number }[],
  ) {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) throw new NotFoundException('Event not found');

    const requestedPairs = seats.map((s) => ({ row: s.row, col: s.col }));

    const existingSeats = await this.seatModel.findAll({
      where: { eventId },
    });

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
        await existing.save();
        updatedSeats.push(existing);
      } else {
        const newSeat: SeatAttributes = {
          eventId,
          row: s.row,
          col: s.col,
          isBooked: true,
        };
        const created = await this.seatModel.create(newSeat as any);
        updatedSeats.push(created);
      }
    }

    return {
      message: 'Seats booked successfully',
      booked: updatedSeats.map((s) => ({ row: s.row, col: s.col })),
    };
  }

  async bookSeats(eventId: number, seats: { row: number; col: number }[]) {
    for (const seat of seats) {
      await this.seatModel.update(
        { isBooked: true },
        { where: { eventId, row: seat.row, col: seat.col } },
      );
    }
    return { success: true };
  }
}
