import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.html',
  styleUrls: ['./event-list.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
})
export class EventsListComponent implements OnInit {
  events: any[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Error loading events:', err),
    });
  }

  goToDetails(event: any) {
    this.router.navigate(['/events-details', event.id], {
      state: { event },
    });
  }
}
