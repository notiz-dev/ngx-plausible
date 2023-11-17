import { inject } from '@angular/core';
import {
  PlausibleEvent,
  PlausibleOptions,
  PlausibleService,
} from '@notiz/ngx-plausible';

export function injectPlausibleEvent() {
  const plausible = inject(PlausibleService);

  return (event: PlausibleEvent, options?: PlausibleOptions) => {
    plausible.event(event, options);
  };
}
