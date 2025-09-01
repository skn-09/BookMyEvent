import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { EventsListComponent } from './events/events-list';
import { AuthGuard } from './guards/auth.guard';
import { SeatBookingComponent } from './events/seat-booking/seat-booking';
import { ThankYouComponent } from './events/Thank-You/thank-you';
import { NotFound } from './not-found/not-found';
import { EventDetailsComponent } from './events/event-details/event-details';
import { UserBookingsComponent } from './user-bookings/user-bookings';

export const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events', component: EventsListComponent },
  { path: 'events-details/:id', component: EventDetailsComponent },
  {
    path: 'book-seats/:id',
    canActivate: [AuthGuard],
    component: SeatBookingComponent,
  },
  { path: 'user-bookings', component: UserBookingsComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: '**', component: NotFound },
];
