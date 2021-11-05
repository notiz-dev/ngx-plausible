import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PlausibleEvent, PlausibleOptions } from './plausible-types';

declare global {
  interface Window {
    plausible: Function;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PlausibleService {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    if (isPlatformBrowser(this.platformId) && !window.plausible) {
      console.warn(
        'Plausible script is missing in the <head> of your index.html. See https://plausible.io/docs/custom-event-goals.'
      );
    }
  }

  event(event: PlausibleEvent | null, options?: PlausibleOptions) {
    if (isPlatformBrowser(this.platformId) && window.plausible && event) {
      window.plausible(event, options);
    }
  }
}
