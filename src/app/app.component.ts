import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <input
      placeholder="Search"
      [(ngModel)]="search"
      [plausibleEvent]="'Search'"
      [plausibleProps]="{ search: search }"
      [plausibleActions]="['focus', 'blur', 'input']"
    />
    <button
      [plausibleEvent]="'Donwload'"
      [plausibleProps]="{ filename: 'test.pdf' }"
    >
      Download
    </button>

    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  title = 'ngx-plausible';

  search = '';
}
