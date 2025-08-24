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

@Injectable({ providedIn: 'root' })
export class SeatsService {
  private apiUrl = 'http://localhost:3000/seats';

  constructor(private http: HttpClient) {}

  getSeats(eventId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${eventId}`);
  }

  toggleSeat(eventId: number, row: number, col: number): Observable<Seat> {
    return this.http.post<Seat>(`${this.apiUrl}/toggle/${eventId}`, { row, col });
  }
}
