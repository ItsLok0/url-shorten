import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LinkService, Link } from '../../services/link';
import { AuthService } from '../../services/auth';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private refresh$ = new BehaviorSubject<void>(undefined);
  links$: Observable<Link[]> = this.refresh$.pipe(
    switchMap(() => this.linkService.getLinks())
  );
  form: FormGroup;
  copied: string | null = null;

  constructor(
    private linkService: LinkService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      originalUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.linkService.createLink(this.form.value.originalUrl).subscribe({
      next: () => {
        this.form.reset();
        // Recharge la liste après création
        this.refresh$.next();
      },
      error: (err) => console.error(err)
    });
  }

  copyLink(shortUrl: string, slug: string) {
    navigator.clipboard.writeText(shortUrl);
    this.copied = slug;
    setTimeout(() => this.copied = null, 2000);
  }
}