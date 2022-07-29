import {
  PlausibleErrorHandler,
  PlausibleModule,
  PLAUSIBLE_ERROR_OPTIONS,
  PlausibleErrorHandlerOptions,
  createPlausibleErrorHandler,
  PlausibleService,
  createPlausibleErrorHandlerProvider,
} from '@notiz/ngx-plausible';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const plausibleErrorOptions: PlausibleErrorHandlerOptions = {
  logErrors: !environment.production,
  plausibleErrorEvent: 'Error', // default event name
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PlausibleModule,
    FormsModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: PlausibleErrorHandler,
    },
    {
      provide: PLAUSIBLE_ERROR_OPTIONS,
      useValue: plausibleErrorOptions,
    },
    // or use
    // {
    //   provide: ErrorHandler,
    //   useFactory: (plausibleService: PlausibleService) =>
    //     createPlausibleErrorHandler(plausibleService, {
    //       logErrors: !environment.production,
    //       plausibleErrorEvent: 'Error', // default event name
    //     }),
    //   deps: [PlausibleService],
    // },
    // or use
    // createPlausibleErrorHandlerProvider({ logErrors: true }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
