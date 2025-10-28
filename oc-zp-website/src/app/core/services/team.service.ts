import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.team;

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
}
