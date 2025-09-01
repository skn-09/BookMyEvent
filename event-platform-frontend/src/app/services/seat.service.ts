import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seat {
  id: number;
  eventId: number;
  row: number;
  col: number;
  isBooked: boolean;
}

export interface Booking {
  eventName: string;
  bookedSeats: string; // "A1, C1"
  totalSeats: number;
}
@Injectable({ providedIn: 'root' })
export class SeatsService {
  private apiUrl = 'http://localhost:3000/seats';

  constructor(private http: HttpClient) {}

  getSeats(eventId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${eventId}`);
  }

  toggleSeat(eventId: number, row: number, col: number): Observable<Seat> {
    return this.http.post<Seat>(`${this.apiUrl}/toggle/${eventId}`, {
      row,
      col,
    });
  }

  getMyBookings(): Observable<{ totalBookings: number; bookings: Booking[] }> {
    return this.http.get<{ totalBookings: number; bookings: Booking[] }>(
      `${this.apiUrl}/user-bookings`
    );
  }
}
