import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PlausibleService } from 'ngx-plausible';

@Injectable()
export class PlausibleErrorHandler implements ErrorHandler {
  constructor(private plausibleService: PlausibleService) {}

  handleError(error: Error): void {
    if (error instanceof HttpErrorResponse) {
      this.plausibleService.event('Error Http', {
        props: {
          error: error.error,
          message: error.message,
          status: error.status,
        },
      });
    } else {
      this.plausibleService.event('Error Client', {
        props: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }
}
