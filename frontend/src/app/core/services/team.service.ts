import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { TeamMember } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.team;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/team`;
  private loadingPromise: Promise<void> | null = null;
  private hasLoadedFromApi = false;

  constructor() {
    void this.ensureLoaded();
  }

  readonly members = this.store.items;
  readonly activeMembers = computed(() => this.store.list().filter(member => member.active));
  readonly count = this.store.count;

  list(): TeamMember[] {
    return this.store.list();
  }

  getById(id: string): TeamMember | undefined {
    return this.store.getById(id);
  }

  create(member: TeamMember): TeamMember {
    return this.store.create(member);
  }

  update(id: string, patch: Partial<TeamMember>): TeamMember | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  async refresh(): Promise<void> {
    await this.loadFromApi(true);
  }

  async ensureLoaded(): Promise<void> {
    await this.loadFromApi();
  }

  private async loadFromApi(force = false): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }
    if (!force && this.hasLoadedFromApi) {
      return;
    }
    this.loadingPromise = firstValueFrom(this.http.get<TeamMember[]>(this.apiUrl))
      .then(items => {
        this.store.replace(items);
        this.hasLoadedFromApi = true;
      })
      .catch(error => {
        console.error('Failed to load team members from API', error);
      })
      .finally(() => {
        this.loadingPromise = null;
      });
    await this.loadingPromise;
  }
}
