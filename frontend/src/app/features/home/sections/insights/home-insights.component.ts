import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent, InsightItem, SectionHeaderContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { BlogPost } from '../../../../core/models';

type InsightCard = InsightItem & {
  slug?: string;
  coverUrl?: string;
  publishedAt?: string;
};

@Component({
  selector: 'app-home-insights',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, ScrollRevealDirective],
  templateUrl: './home-insights.component.html',
  styleUrl: './home-insights.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeInsightsComponent {
  @Input({ required: true }) data!: HomeContent['insights'];
  @Input() posts: BlogPost[] = [];

  protected get header(): SectionHeaderContent {
    return this.data.header;
  }

  protected get cards(): InsightCard[] {
    if (this.posts?.length) {
      return this.posts.map((post) => ({
        title: post.title,
        category: post.tags[0] ?? 'Blog',
        summary: post.excerpt,
        readTime: this.calculateReadTime(post.content),
        slug: post.slug ?? undefined,
        coverUrl: post.coverUrl,
        publishedAt: post.publishedAt,
      }));
    }

    return this.data.items.map((item) => ({
      ...item,
    }));
  }

  private calculateReadTime(content: string): string {
    const text = content.replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }
}
