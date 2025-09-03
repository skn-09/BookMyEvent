import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http
      .get<any>('http://localhost:3000/events')
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data ?? [])));
  }

  getEventById(eventId: number) {
    return this.http.get<any>(`http://localhost:3000/events/${eventId}`);
  }

  getSeats(eventId: number) {
    return this.http.get<any>(`http://localhost:3000/events/${eventId}/seats`);
  }

  bookSeats(eventId: number, seats: { row: number; col: number }[]) {
    const token = localStorage.getItem('auth_token');
    return this.http.post(
      `http://localhost:3000/events/${eventId}/book-seats`,
      {
        seats,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUserBookings(userId: number) {
    return this.http.get<any>(
      `http://localhost:3000/events/user/${userId}/bookings`
    );
  }

  cancelBooking(eventId: number, seatIds: number[]) {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(
      `http://localhost:3000/events/${eventId}/cancel-booking`,
      {
        headers: { Authorization: `Bearer ${token}` },
        body: { seatIds }, // DELETE can have body in Angular >= v5
      }
    );
  }
}
