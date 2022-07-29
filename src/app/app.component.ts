import { PlausibleService } from '@notiz/ngx-plausible';
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
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

    <button (click)="submitError()">Submit</button>

    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  search = '';

  constructor(private plausible: PlausibleService, private http: HttpClient) {}

  submitError() {
    throw new HttpErrorResponse({ status: 400, error: 'Bad Request' });
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
