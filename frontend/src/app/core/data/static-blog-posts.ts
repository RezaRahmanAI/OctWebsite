import { BlogPost } from '../models';

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b0f34359-4f0c-4f1f-86e0-4b232d42928b',
    title: 'How We Blend Services with Learning',
    slug: 'blend-services-with-learning',
    excerpt:
      'A behind-the-scenes look at how our delivery squads collaborate with academy mentors.',
    coverUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Our dual-engine model creates a feedback loop between client projects and the academy. We share playbooks, tooling, and retrospectives with our learners so they build market-ready confidence.</p><p>Every sprint uncovers new teaching moments that shape ZeroProgrammingBD curriculum updates.</p>',
    tags: ['Culture', 'Academy'],
    published: true,
    publishedAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: '7b8fb0dd-7721-4e7b-a5e3-08f6d93e4a4f',
    title: 'Designing Reliable Commerce Experiences',
    slug: 'designing-reliable-commerce-experiences',
    excerpt: 'Discover the blueprints we use to launch commerce platforms that delight shoppers.',
    coverUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>From modular UI kits to rigorous QA automation, we ensure ecommerce ecosystems stay performant under scale.</p><p>Our teams blend analytics with CRO experimentation to keep conversion at the center.</p>',
    tags: ['Commerce', 'Product'],
    published: true,
    publishedAt: '2025-02-02T11:30:00.000Z',
  },
  {
    id: 'ec4554a2-22fd-4b4e-bdf6-7bc7566e1fe0',
    title: 'Preparing Learners for Freelancing Wins',
    slug: 'preparing-learners-for-freelancing-wins',
    excerpt:
      'How we pair career coaching with portfolio challenges to help learners earn globally.',
    coverUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Freelancing success is more than technical skills. We mentor communication, pricing, and client operations.</p><p>Learners graduate with templates, scripts, and confidence to thrive independently.</p>',
    tags: ['Academy', 'Career'],
    published: true,
    publishedAt: '2025-03-15T14:00:00.000Z',
  },
];
