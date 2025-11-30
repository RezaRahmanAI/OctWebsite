import { Signal } from '@angular/core';
import { AcademyTrack, BlogPost, CompanyAbout, Lead, ProductItem, ServiceItem, TeamMember } from '../models';

export interface EntityStore<T> {
  readonly items: Signal<T[]>;
  readonly count: Signal<number>;
  list(): T[];
  getById(id: string): T | undefined;
  getBySlug?(slug: string): T | undefined;
  create(item: T): T;
  update(id: string, item: Partial<T>): T | undefined;
  delete(id: string): void;
  replace(items: T[]): void;
}

export interface DataProvider {
  readonly team: EntityStore<TeamMember>;
  readonly about: EntityStore<CompanyAbout>;
  readonly services: EntityStore<ServiceItem>;
  readonly products: EntityStore<ProductItem>;
  readonly academy: EntityStore<AcademyTrack>;
  readonly blog: EntityStore<BlogPost>;
  readonly leads: EntityStore<Lead>;
}
