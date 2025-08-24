import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { EventsListComponent } from './events/events-list';
import { AuthGuard } from './guards/auth.guard';
import { SeatBookingComponent } from './events/seat-booking/seat-booking';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events', component: EventsListComponent },
  {
    path: 'book-seats/:id',
    canActivate: [AuthGuard],
    component: SeatBookingComponent,
  },
  { path: '**', redirectTo: '' },
];
