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
  eventId: number; // ✅ added
  eventName: string;
  price: number;
  bookedSeats: string;
  totalSeats: number;
}

@Injectable({ providedIn: 'root' })
export class SeatsService {
  private apiUrl = 'http://localhost:3000/seats';

  constructor(private http: HttpClient) {}

  getSeats(eventId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${eventId}`);
  }

  getMyBookings(): Observable<{ totalBookings: number; bookings: Booking[] }> {
    const token = localStorage.getItem('token');
    if (!token) return of({ totalBookings: 0, bookings: [] });

    return this.http.get<{ totalBookings: number; bookings: Booking[] }>(
      `${this.apiUrl}/user-bookings`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  cancelBooking(eventId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/cancel/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
