import { Pipe, PipeTransform, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Pipe({
  name: 'assetUrl',
  standalone: true
})
export class AssetUrlPipe implements PipeTransform {
  private readonly document = inject(DOCUMENT, { optional: true });

  transform(path: string | null | undefined): string {
    if (!path) return '';

    const value = `${path}`.trim();
    if (!value) return '';

    // Leave fully-qualified URLs untouched
    if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) {
      return value;
    }

    const baseHref = this.document?.baseURI ?? (typeof location !== 'undefined' ? location.href : '/');
    const normalizedPath = value.replace(/^\/+/, '');
    const strippedPublicPath = normalizedPath.startsWith('public/')
      ? normalizedPath.replace(/^public\//, '')
      : normalizedPath;

    try {
      const url = new URL(strippedPublicPath, baseHref);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      const fallbackPath = strippedPublicPath || normalizedPath;
      return fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`;
    }
  }
}

