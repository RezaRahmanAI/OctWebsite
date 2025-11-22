import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.team;
  private readonly defaultTeam: TeamMember[] = [
    {
      id: 'team-founder',
      name: 'Tasfic Solaiman',
      role: 'Founder · Principal Engineer',
      bio: 'Leads engineering strategy, architecture, and mentorship across delivery teams.',
      photoUrl: '/images/team/team.jpg',
      email: 'hello@objectcanvas.com',
      active: true,
    },
    {
      id: 'team-engineering-lead',
      name: 'Senior Engineering Lead',
      role: 'Full-stack & Cloud',
      bio: 'Focuses on distributed systems, performance, and delivery excellence.',
      photoUrl: '/images/team/team.jpg',
      email: 'engineering@objectcanvas.com',
      active: true,
    },
  ];

  constructor() {
    this.seedDefaults();
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
    const created: TeamMember = { ...member, id: member.id ?? this.generateId(), active: member.active ?? true };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated: TeamMember = { ...current, ...patch } as TeamMember;
    this.store.update(id, updated);
    return Promise.resolve(updated);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async refresh(): Promise<void> {
    this.seedDefaults(true);
  }

  async ensureLoaded(): Promise<void> {
    this.seedDefaults(true);
  }

  private seedDefaults(force = false): void {
    if (!force && this.store.list().length > 0) {
      return;
    }
    this.store.replace(this.defaultTeam);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
