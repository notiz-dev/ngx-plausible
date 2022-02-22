import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { defer, Observable } from 'rxjs';
import {
  ObservablePlausibleEvents,
  PlausibleEvent,
  PlausibleOptions,
  resolveValueOrFunction,
} from './plausible-types';

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

  observe<T>({
    loading,
    success: successEvent,
    error: errorEvent,
  }: ObservablePlausibleEvents<T>): (source: Observable<T>) => Observable<T> {
    return (source) => {
      return defer(() => {
        if (loading) {
          this.event(loading.event, loading.options);
        }

        return source.pipe(
          tap({
            ...(successEvent && {
              next: (response) => {
                const event = resolveValueOrFunction(successEvent, response);
                this.event(event.event, event.options);
              },
            }),
            ...(errorEvent && {
              error: (error) => {
                const event = resolveValueOrFunction(errorEvent, error);
                this.event(event.event, event.options);
              },
            }),
          })
        );
      });
    };
  }
}
