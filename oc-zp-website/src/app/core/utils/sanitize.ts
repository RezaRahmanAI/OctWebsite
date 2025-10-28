import { inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export function sanitizeHtml(content: string): SafeHtml {
  const sanitizer = inject(DomSanitizer);
  return sanitizer.bypassSecurityTrustHtml(content);
}
