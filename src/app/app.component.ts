import { PlausibleService, injectPlausibleEvent } from '@notiz/ngx-plausible';
import { Component, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { PlausibleEventDirective } from '@notiz/ngx-plausible';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, PlausibleEventDirective, RouterOutlet],
  template: `
    <input
      placeholder="Search"
      [(ngModel)]="search"
      [plausibleEvent]="'Search'"
      [plausibleProps]="{ search: search }"
      [plausibleActions]="['focus', 'blur', 'input']"
    />
    <button
      [plausibleEvent]="'Donwload'"
      [plausibleProps]="{ filename: 'test.pdf' }"
    >
      Download
    </button>

    <a href="https://notiz.dev" target="_blank" [plausibleEvent]="'Naviagtion'">
      notiz.dev
    </a>

    <form>
      <!-- contact form -->
    </form>

    <button (click)="triggerEvent()">Submit</button>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  private http = inject(HttpClient);
  private plausible = inject(PlausibleService);

  plausibleEvent = injectPlausibleEvent();

  search = '';

  triggerEvent() {
    this.plausibleEvent('Test', { props: { action: 'clicked' } });
  }

  sendContactForm() {
    this.http
      .post('https://api.example.dev/contact', {
        name: '...',
        email: '...',
        message: '...',
      })
      .pipe(
        this.plausible.observe({
          loading: {
            event: 'Contact',
            options: { props: { action: 'loading' } },
          },
          success: (response) => {
            return {
              event: 'Contact',
              options: {
                props: { action: 'submitted' },
              },
            };
          },
          error: (error) => {
            return {
              event: 'Contact',
              options: { props: { action: 'error' } },
            };
          },
        })
      )
      .subscribe({
        complete: () => {
          this.plausible.event('Contact', { props: { action: 'submitted' } });
        },
      });
  }
}
