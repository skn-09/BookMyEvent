import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Seat {
  id: number;
  eventId: number;
  row: number;
  col: number;
  isBooked: boolean;
}

export interface Booking {
  eventName: string;
  price: number;
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
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, return empty bookings
      return of({ totalBookings: 0, bookings: [] });
    }
    return this.http.get<{ totalBookings: number; bookings: Booking[] }>(
      `${this.apiUrl}/user-bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
