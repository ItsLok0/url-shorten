import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Link {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface Stats {
  id: string;
  slug: string;
  originalUrl: string;
  totalClicks: number;
  clicksByDay: { [date: string]: number };
}

@Injectable({ providedIn: 'root' })
export class LinkService {
  private apiUrl = 'http://localhost:3000/links';

  constructor(private http: HttpClient) {}

  getLinks() {
    // L'interceptor ajoute le token automatiquement — pas besoin de le passer ici
    return this.http.get<Link[]>(this.apiUrl);
  }

  createLink(originalUrl: string) {
    return this.http.post<Link>(this.apiUrl, { originalUrl });
  }

  getStats(id: string) {
    return this.http.get<Stats>(`${this.apiUrl}/${id}/stats?t=${Date.now()}`);
  }
}