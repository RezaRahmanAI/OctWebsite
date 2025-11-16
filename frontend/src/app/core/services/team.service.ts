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

  async create(member: TeamMember): Promise<TeamMember> {
    const payload = this.toRequest(member);
    const created = await firstValueFrom(this.http.post<TeamMember>(this.apiUrl, payload));
    this.store.create(created);
    return created;
  }

  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const payload = this.toRequest({ ...current, ...patch });
    const updated = await firstValueFrom(this.http.put<TeamMember>(`${this.apiUrl}/${id}`, payload));
    this.store.update(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
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

  private toRequest(member: Partial<TeamMember>): Omit<TeamMember, 'id'> {
    return {
      name: member.name ?? '',
      role: member.role ?? '',
      photoUrl: member.photoUrl ?? '',
      bio: member.bio ?? '',
      email: member.email ?? '',
      active: member.active ?? true,
    };
  }
}
