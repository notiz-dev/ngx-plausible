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
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  event(event: PlausibleEvent | null, options?: PlausibleOptions) {
    if (isPlatformBrowser(this.platformId) && event) {
      window.plausible(event, options);
    }
  }
}
