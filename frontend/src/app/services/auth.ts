import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  // Clé utilisée pour stocker le token dans localStorage
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password });
  }

  // Sauvegarde le token après login/register
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Récupère le token — utilisé par l'interceptor
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}