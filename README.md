# NgxPlausible

[![npm version](https://badge.fury.io/js/@notiz%2Fngx-plausible.svg)](https://www.npmjs.com/package/@notiz/ngx-plausible)

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

## Error Handling

Use `PlausibleErrorHandler` to track `HttpErrorResponse`'s and client `Error`s.

```ts
import { PlausibleErrorHandler, PlausibleModule } from '@notiz/ngx-plausible';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlausibleModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: PlausibleErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Add the following events as **Custom event** to the goals settings of your page:

- `Error Http` for `HttpErrorResponse`
- `Error Client` for client side `Error`'s
