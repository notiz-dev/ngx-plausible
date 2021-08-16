# NgxPlausible

```bash
npm i ngx-plausible
```

Import `PlausibleModule` into your component module and use `plausibleEvent` directive to trigger events.

```html
<a
  href="..."
  [plausibleEvent]="'Download'"
  [plausibleProps]="{filename: 'pricing.pdf'}"
>
  Download pricing
</a>
```
