import { Component } from '@angular/core';
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
  seats: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.seats = this.route.snapshot.queryParamMap.get('seats');
  }
}
