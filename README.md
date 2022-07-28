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

Import `PlausibleModule` into your component module and use `plausibleEvent` directive to trigger events.

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
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlausibleService } from '@notiz/ngx-plausible';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <!-- contact form -->
    </form>
  `,
  styles: [],
})
export class AppComponent {
  constructor(private plausible: PlausibleService, private http: HttpClient) {}

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
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlausibleService } from '@notiz/ngx-plausible';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <!-- contact form -->
    </form>
  `,
  styles: [],
})
export class AppComponent {
  constructor(private plausible: PlausibleService, private http: HttpClient) {}

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

## Error Handling

Use `PlausibleErrorHandler` to track error's in your Angular application. The event will only show up in Plausible when you create a [custom event goal](https://plausible.io/docs/custom-event-goals#2-create-a-custom-event-goal-in-your-plausible-analytics-account) for your page.

Create a custom event goal for the default event name: `Error`. Otherwise provide a custom event name by passing `plausibleErrorEvent` and create a custom event goal for custom event name.

```ts
import {
  PlausibleErrorHandler,
  PlausibleModule,
  PLAUSIBLE_ERROR_OPTIONS,
  PlausibleErrorHandlerOptions,
} from '@notiz/ngx-plausible';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

const plausibleErrorOptions: PlausibleErrorHandlerOptions = {
  logErrors: !environment.production,
  plausibleErrorEvent: 'Error', // default event name
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlausibleModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: PlausibleErrorHandler,
    },
    {
      provide: PLAUSIBLE_ERROR_OPTIONS,
      useValue: plausibleErrorOptions,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Or use `createPlausibleErrorHandler` to configure the `PlausibleErrorHandler` via a factory.

```ts
import {
  PlausibleModule,
  createPlausibleErrorHandler,
  PlausibleService,
} from '@notiz/ngx-plausible';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlausibleModule],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: (plausibleService: PlausibleService) =>
        createPlausibleErrorHandler(plausibleService, {
          logErrors: !environment.production,
          plausibleErrorEvent: 'Error', // default event name
        }),
      deps: [PlausibleService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Configure `PlausibleErrorHandler` with `PlausibleErrorHandlerOptions`:

| Option                | Default         |
| --------------------- | --------------- |
| `logErrors`           | `false`         |
| `plausibleErrorEvent` | `Error`         |
| `extractor`           | Default provide |
