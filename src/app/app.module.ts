import { PlausibleModule } from 'ngx-plausible';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlausibleModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
