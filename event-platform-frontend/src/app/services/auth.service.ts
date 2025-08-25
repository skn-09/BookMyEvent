import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private _isAuthed = new BehaviorSubject<boolean>(this.checkToken());
  public isAuthed$ = this._isAuthed.asObservable();
  private checkToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: { email: string; password: string }) {
    return this.http
      .post<{ success: boolean; data: { access_token: string } }>(
        'http://localhost:3000/auth/login',
        payload
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data?.access_token) {
            localStorage.setItem(this.tokenKey, res.data.access_token);
            this._isAuthed.next(true);
          }
        })
      );
  }

  signup(payload: {
    username: string;
    email: string;
    contact: string;
    password: string;
  }) {
    return this.http.post('http://localhost:3000/auth/signup', payload);
  }

  logout() {
    this.http.post('http://localhost:3000/auth/logout', {}).subscribe({
      next: () => {
        localStorage.removeItem(this.tokenKey);
        this._isAuthed.next(false);
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem(this.tokenKey);
        this._isAuthed.next(false);
        this.router.navigate(['/login']);
      },
    });
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isAuthed(): boolean {
    return !!this.token;
  }
}
