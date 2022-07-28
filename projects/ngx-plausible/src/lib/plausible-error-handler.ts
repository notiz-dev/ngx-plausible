import {
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  Optional,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PlausibleService } from './plausible.service';

export interface PlausibleErrorHandlerOptions {
  /**
   * Useful for development.
   *
   * Use with `!environment.production`.
   */
  logErrors?: boolean;

  /**
   * Default to 'Error'.
   */
  plausibleErrorEvent?: string;

  /**
   * Provide your custom logic to extract the error.
   *
   * @param error Captured by Angular
   * @param defaultExtractor Default logic to extract the error
   */
  extractor?(error: any, defaultExtractor: (error: any) => any): any;
}

export const PLAUSIBLE_ERROR_OPTIONS =
  new InjectionToken<PlausibleErrorHandlerOptions>('PLAUSIBLE_ERROR_OPTIONS');

@Injectable()
export class PlausibleErrorHandler implements ErrorHandler {
  constructor(
    private plausibleService: PlausibleService,
    @Optional()
    @Inject(PLAUSIBLE_ERROR_OPTIONS)
    private options?: PlausibleErrorHandlerOptions
  ) {
    console.log(options);
  }

  handleError(error: any): void {
    const extractedError = this.extractError(error) || 'Unknown error';

    this.plausibleService.event(this.plausibleEventName(), {
      props: {
        error: extractedError,
      },
    });

    if (this.options?.logErrors) {
      console.error(extractedError);
    }
  }

  private plausibleEventName() {
    return this.options?.plausibleErrorEvent || 'Error';
  }

  private extractError(error: any): any {
    if (this.options?.extractor) {
      const defaultExtractor = this.defaultExtractor.bind(this);
      return this.options.extractor(error, defaultExtractor);
    }

    return this.defaultExtractor(error);
  }

  protected defaultExtractor(errorCandidate: unknown): unknown {
    let error = errorCandidate;

    if (error && (error as { ngOriginalError: Error }).ngOriginalError) {
      error = (error as { ngOriginalError: Error }).ngOriginalError;
    }

    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof Error) {
        return error.error;
      }

      if (error.error instanceof ErrorEvent && error.error.message) {
        return error.error.message;
      }

      if (typeof error.error === 'string') {
        return `[${error.status}]: ${error.error}`;
      }

      return error.message;
    }

    return null;
  }
}

export function createPlausibleErrorHandler(
  plausibleService: PlausibleService,
  options?: PlausibleErrorHandlerOptions
) {
  return new PlausibleErrorHandler(plausibleService, options);
}
