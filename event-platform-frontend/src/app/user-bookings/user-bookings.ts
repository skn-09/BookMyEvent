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
  loading = true;

  constructor(private seatsService: SeatsService) {}

  ngOnInit(): void {
    this.seatsService.getMyBookings().subscribe({
      next: (res: any) => {
        const data = res?.data || { totalBookings: 0, bookings: [] };
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

  loadBookings(): void {
    this.seatsService.getMyBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings || [];
        this.totalBookings = res.totalBookings || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
        this.loading = false;
      },
    });
  }

  cancelBooking(eventId: number): void {
    const confirmCancel = confirm(
      'Are you sure you want to cancel this booking?'
    );
    if (!confirmCancel) return;

    this.seatsService.cancelBooking(eventId).subscribe({
      next: () => {
        console.log('Booking cancelled');

        this.seatsService.getMyBookings().subscribe({
          next: (updated: any) => {
            const data = updated?.data || { totalBookings: 0, bookings: [] };
            this.bookings = data.bookings;
            this.totalBookings = data.totalBookings;
          },
          error: (err) => console.error('Error refreshing bookings', err),
        });
      },
      error: (err) => console.error('Error cancelling booking', err),
    });
  }
}
