# NgxPlausible

```bash
npm i ngx-plausible
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
import { PlausibleErrorHandler, PlausibleModule } from 'ngx-plausible';
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
