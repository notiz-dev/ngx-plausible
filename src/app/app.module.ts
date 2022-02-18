import { PlausibleErrorHandler, PlausibleModule } from '@notiz/ngx-plausible';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
