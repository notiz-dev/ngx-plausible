import { Directive, HostListener, Input } from '@angular/core';
import { PlausibleService } from './plausible.service';
import { PlausibleEvent } from './plausible-types';

@Directive({
  selector: '[plausibleEvent]',
})
export class PlausibleEventDirective {
  @Input() plausibleEvent: PlausibleEvent | null = null;
  @Input() plausibleCallback?: Function;
  @Input() plausibleProps?: Object;

  @HostListener('click') onClick() {
    this.plausibleService.event(this.plausibleEvent, {
      callback: this.plausibleCallback,
      props: this.plausibleProps,
    });
  }

  constructor(private plausibleService: PlausibleService) {}
}
