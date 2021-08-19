import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { PlausibleService } from './plausible.service';
import { PlausibleEvent } from './plausible-types';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { ElementRef } from '@angular/core';

@Directive({
  selector: '[plausibleEvent]',
})
export class PlausibleEventDirective implements OnInit, OnDestroy {
  @Input() plausibleEvent: PlausibleEvent | null = null;
  @Input() plausibleCallback?: Function;
  @Input() plausibleProps?: Object;
  @Input() plausibleEventDebounce = 500;

  /**
   * Default to `click` events.
   *
   */
  @Input() plausibleActions = ['click'];

  private destroy$ = new Subject<void>();

  constructor(
    private plausibleService: PlausibleService,
    private el: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    merge(
      ...this.plausibleActions.map((e) =>
        fromEvent(this.el.nativeElement, e).pipe(map((ev) => e))
      )
    )
      .pipe(
        debounceTime(this.plausibleEventDebounce),
        tap(() => {
          this.plausibleService.event(this.plausibleEvent, {
            callback: this.plausibleCallback,
            props: this.plausibleProps,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
