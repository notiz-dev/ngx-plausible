import { inject } from '@angular/core';
import { PlausibleService } from './plausible.service';
import { PlausibleEvent, PlausibleOptions } from './plausible-types';

export function injectPlausibleEvent() {
  const plausible = inject(PlausibleService);

  return (event: PlausibleEvent, options?: PlausibleOptions) => {
    plausible.event(event, options);
  };
}
