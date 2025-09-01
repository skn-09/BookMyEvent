import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../services/event.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
})
export class EventDetailsComponent implements OnInit {
  event: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.event = nav?.extras?.state?.['event'];
  }

  ngOnInit(): void {
    if (!this.event) {
      const eventId = Number(this.route.snapshot.paramMap.get('id'));
      if (eventId) {
        this.eventService.getEventById(eventId).subscribe({
          next: (data: any) => (this.event = data),
          error: (err: any) => console.error('Error fetching event:', err),
        });
      }
    }
  }

  bookSeats() {
    if (this.event && this.event.id) {
      this.router.navigate(['/book-seats', this.event.id]);
    }
  }
}
