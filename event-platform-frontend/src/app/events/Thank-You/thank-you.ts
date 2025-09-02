import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardContent } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.html',
  styleUrls: ['./thank-you.css'],
  imports: [MatCardContent, MatCardHeader, MatCard, CommonModule],
})
export class ThankYouComponent {
  event: any = null;
  eventNotFound: boolean = false;
  seats: string | null = null;
  eventId: number | null = null;
  price: number = 0;
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    this.seats = this.route.snapshot.queryParamMap.get('seats');
    const eventIdParam = this.route.snapshot.queryParamMap.get('eventId');
    this.eventId = eventIdParam ? Number(eventIdParam) : null;
    console.log(
      'ThankYouComponent: eventId',
      this.eventId,
      'seats',
      this.seats
    );
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event: any) => {
          this.event = event.data;
          const seatCount = this.seats ? this.seats.split(',').length : 0;
          this.totalPrice = (this.event.price ?? 0) * seatCount;
        },
        error: (err) => {
          this.eventNotFound = true;
          console.error('ThankYouComponent: event fetch error', err);
        },
      });
    }
  }
}
