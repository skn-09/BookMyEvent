import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { EventService } from '../../services/event.service';
import { MatIconModule } from '@angular/material/icon';

interface Seat {
  row: number;
  col: number;
  status: 'available' | 'selected' | 'booked';
}

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  templateUrl: './seat-booking.html',
  styleUrls: ['./seat-booking.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
})
export class SeatBookingComponent implements OnInit {
  eventId!: number;
  rows = 10;
  cols = 8;
  seats: Seat[][] = [];
  bookedSeats: Seat[] = [];
  bookingConfirmed = false;
  title: string = '';
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  bookings: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventId = id ? Number(id) : 0;

    if (this.eventId > 0) this.loadSeats();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.eventId > 0) {
        this.loadSeats();
      }
    });
  }

  loadSeats(): void {
    this.eventService.getSeats(this.eventId).subscribe({
      next: (serverSeats: any | { seats: any[] }) => {
        const list: any[] = Array.isArray(serverSeats)
          ? serverSeats
          : serverSeats.data || [];
        this.rows = Math.max(10, ...list.map((s: any) => s.row || 0));
        this.cols = Math.max(8, ...list.map((s: any) => s.col || 0));
        this.seats = [];
        for (let r = 1; r <= this.rows; r++) {
          const row: Seat[] = [];
          for (let c = 1; c <= this.cols; c++) {
            const found = list.find((s: any) => s.row === r && s.col === c);
            row.push({
              row: r,
              col: c,
              status: found?.isBooked ? 'booked' : 'available',
            });
          }
          this.seats.push(row);
        }
        console.log(this.seats, 'this.seats');
      },
      error: (err) => {
        console.error('Error loading seats:', err);
        this.seats = [];
      },
    });
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked') return;
    seat.status = seat.status === 'selected' ? 'available' : 'selected';
  }

  confirmBooking(): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const selectedSeatsForAPI = this.seats
      .flat()
      .filter((s) => s.status === 'selected')
      .map((s) => ({ row: s.row, col: s.col }));

    if (!selectedSeatsForAPI.length) {
      this.snackBar.open('No seats selected!', 'Close', { duration: 2000 });
      return;
    }

    const userConfirmed = window.confirm(
      'Are you sure you want to confirm this booking?'
    );
    if (!userConfirmed) {
      return;
    }

    this.eventService.bookSeats(this.eventId, selectedSeatsForAPI).subscribe({
      next: () => {
        for (const seat of this.seats
          .flat()
          .filter((s) => s.status === 'selected')) {
          seat.status = 'booked';
        }

        this.bookingConfirmed = true;
        this.snackBar.open('Booking Confirmed', 'Close', { duration: 3000 });

        const selectedSeatsLabels = selectedSeatsForAPI.map(
          (s) => `${alphabet[s.row - 1]}${s.col}`
        );

        this.router.navigate(['/thank-you'], {
          queryParams: {
            seats: selectedSeatsLabels.join(', '),
            eventId: this.eventId,
          },
        });
      },
      error: (err) => {
        console.error('Booking failed:', err);
        this.snackBar.open('Booking Failed', 'Close', { duration: 3000 });
      },
    });
  }
}
