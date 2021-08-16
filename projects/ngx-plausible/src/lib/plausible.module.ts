import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlausibleEventDirective } from './plausible-event.directive';

@NgModule({
  declarations: [PlausibleEventDirective],
  exports: [PlausibleEventDirective],
  imports: [CommonModule],
})
export class PlausibleModule implements OnInit {
  ngOnInit(): void {
    console.log('PlausibleModule');
  }
}
