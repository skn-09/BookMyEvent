import { IsArray, IsInt } from 'class-validator';

export class BookSeatsDto {
  @IsInt()
  eventId: number;

  @IsArray()
  selectedSeats: { row: number; col: number }[];
  seats: any;
}
