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

  getSeats(eventId: number) {
    return this.http.get<any>(`http://localhost:3000/events/${eventId}/seats`);
  }

  bookSeats(eventId: number, seats: { row: number; col: number }[]) {
    return this.http.post(
      `http://localhost:3000/events/${eventId}/book-seats`,
      {
        seats,
      }
    );
  }

  addEvent(payload: any) {
    return this.http.post('http://localhost:3000/events', payload);
  }
}
