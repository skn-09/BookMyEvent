import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterLink],
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  isAuthed$!: Observable<boolean>;

  constructor(private auth: AuthService, private router: Router) {
    this.isAuthed$ = this.auth.isAuthed$;
  }

  logout() {
    this.auth.logout();
  }

  handleLogin() {
    this.router.navigate(['/login']);
  }
}
