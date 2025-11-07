import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services';

type EditorialTheme = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  readonly searchTerm = signal('');
  readonly activeTag = signal<string | null>(null);

  readonly heroCopy = {
    eyebrow: 'Blog',
    title: 'Field notes from ObjectCanvas and ZeroProgramming',
    intro:
      'Stories, frameworks, and playbooks from the teams shipping digital products, automation, and enablement across industries.'
  };

  readonly editorialThemes: EditorialTheme[] = [
    {
      title: 'Product & Experience',
      description: 'Discovery rituals, service design patterns, and customer journeys that deliver measurable value.'
    },
    {
      title: 'Automation & Engineering',
      description: 'Architectures, accelerators, and operational lessons from ZeroProgramming implementations.'
    },
    {
      title: 'Enablement & Culture',
      description: 'Change management, leadership enablement, and Academy insights that keep teams thriving.'
    }
  ];

  readonly tags = this.blogService.tags;

  readonly posts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tag = this.activeTag();
    return this.blogService
      .posts()
      .filter(post =>
        !term ||
        [post.title, post.excerpt, post.tags.join(' ')].some(field => field.toLowerCase().includes(term))
      )
      .filter(post => (!tag ? true : post.tags.includes(tag)));
  });

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
  }
}
