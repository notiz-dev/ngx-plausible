# @notiz/ngx-plausible

[![npm version](https://badge.fury.io/js/@notiz%2Fngx-plausible.svg)](https://www.npmjs.com/package/@notiz/ngx-plausible)

Integrate [Plausible](https://plausible.io/) [custom event](https://plausible.io/docs/custom-event-goals) easily into your Angular application.

## Installation

```bash
npm i @notiz/ngx-plausible
```

Add plausible [script](https://plausible.io/docs/plausible-script) for your domain and register a global function called `plausible` for [custom events](https://plausible.io/docs/custom-event-goals) in your `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>NgxPlausible</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />

    <!-- plausible -->
    <!-- replace yourdomain.com  -->
    <!-- use different script extensions https://plausible.io/docs/script-extensions -->
    <script
      defer
      data-domain="yourdomain.com"
      src="https://plausible.io/js/plausible.js"
    ></script>
    <!-- required for custom events with `plausible` function -->
    <script>
      window.plausible =
        window.plausible ||
        function () {
          (window.plausible.q = window.plausible.q || []).push(arguments);
        };
    </script>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

Import `PlausibleEventDirective` into your component module and use `plausibleEvent` directive to trigger events.

```html
<a
  href="..."
  [plausibleEvent]="'Download'"
  [plausibleProps]="{filename: 'pricing.pdf'}"
>
  Download pricing
</a>
```

## Plausible Service

Use directly `PlausibleService` to trigger an event.

```ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlausibleService } from '@notiz/ngx-plausible';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <form>
      <!-- contact form -->
    </form>
  `,
  styles: [],
})
export class AppComponent {
  private http = inject(HttpClient);
  private plausible = inject(PlausibleService);

  sendContactForm() {
    this.http
      .post('https://api.example.dev/contact', {
        name: '...',
        email: '...',
        message: '...',
      })
      .subscribe({
        complete: () => {
          this.plausible.event('Contact', { props: { action: 'submitted' } });
        },
      });
  }
}
```

Or observe your data streams such as http calls.

```ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlausibleService } from '@notiz/ngx-plausible';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <form>
      <!-- contact form -->
    </form>
  `,
  styles: [],
})
export class AppComponent {
  private http = inject(HttpClient);
  private plausible = inject(PlausibleService);

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
      .subscribe();
  }
}
```

## injectPlausibleEvent

`injectPlausibleEvent` is a helper function that allows to inject plausible service and trigger events.

```ts
@Component({
  standalone: true,
  template: '<button (click)="triggerEvent()">New Event</button>',
})
class TestComponent {
  plausibleEvent = injectPlausibleEvent();

  triggerEvent() {
    // TODO does something

    this.plausibleEvent('Event');
  }
}
```
