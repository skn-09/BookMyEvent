import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SeatsService, Booking } from '../services/seat.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.html',
  styleUrls: ['./user-bookings.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
})
export class UserBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  totalBookings: number = 0;
  loading: boolean = true;

  constructor(private seatsService: SeatsService) {}

  ngOnInit(): void {
    this.seatsService.getMyBookings().subscribe({
      next: (res) => {
        const data: any =
          res && typeof res === 'object' && 'data' in res
            ? (res as any).data
            : res;
        this.bookings = data.bookings || [];
        this.totalBookings = data.totalBookings || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
        this.loading = false;
      },
    });
  }
}
