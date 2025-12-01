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
      '<p>Our dual-engine model creates a feedback loop between client projects and the academy. We share playbooks, tooling, and retrospectives with our learners so they build market-ready confidence.</p><p>Every sprint uncovers new teaching moments that shape curriculum updates. Delivery teams surface real-world blockers and our faculty convert them into masterclasses, templates, and walkthroughs the same week.</p><p>By pairing practitioners with mentors, we ship production features and learning assets in parallel, so every engagement improves the next cohort’s outcomes.</p>',
    tags: ['Culture', 'Academy'],
    published: true,
    publishedAt: '2025-01-10T09:00:00.000Z',
    author: 'Ada Ncube',
    authorTitle: 'Director of Delivery',
    readTime: '7 min read',
    heroQuote: '“Building together is how we keep our academy grounded in what teams truly need.”',
    keyPoints: [
      'Sprints double as live curriculum labs.',
      'Mentors and engineers review retros together every Friday.',
      'Templates, checklists, and decision logs ship to learners weekly.',
    ],
    stats: [
      { label: 'Academy playbooks shipped', value: '42' },
      { label: 'Avg. sprint NPS', value: '9.3' },
      { label: 'Countries represented', value: '18' },
    ],
  },
  {
    id: '7b8fb0dd-7721-4e7b-a5e3-08f6d93e4a4f',
    title: 'Designing Reliable Commerce Experiences',
    slug: 'designing-reliable-commerce-experiences',
    excerpt: 'Discover the blueprints we use to launch commerce platforms that delight shoppers.',
    coverUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>From modular UI kits to rigorous QA automation, we ensure ecommerce ecosystems stay performant under scale.</p><p>Our teams blend analytics with CRO experimentation to keep conversion at the center. Each launch is instrumented with product analytics, A/B testing, and synthetic monitoring so we can recover issues before customers notice.</p><p>Design systems keep merchandising, campaigns, and loyalty flows consistent while micro-optimizations deliver compound conversion gains.</p>',
    tags: ['Commerce', 'Product'],
    published: true,
    publishedAt: '2025-02-02T11:30:00.000Z',
    author: 'Devin Mora',
    authorTitle: 'Product Design Lead',
    heroQuote: '“Reliability is the most underrated UX pattern in commerce.”',
    keyPoints: [
      'Launch playbooks for flash sales and peak events.',
      'Conversion experiments run weekly with paired analysts.',
      'Observability and QA checks guard the checkout funnel.',
    ],
    stats: [
      { label: 'Checkout uptime', value: '99.95%' },
      { label: 'A/B tests shipped', value: '60+' },
      { label: 'Avg. uplift per experiment', value: '+3.1%' },
    ],
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
      '<p>Freelancing success is more than technical skills. We mentor communication, pricing, and client operations.</p><p>Learners graduate with templates, scripts, and confidence to thrive independently. Demo days simulate client calls, contract reviews, and scope changes so learners rehearse scenarios before they encounter them.</p><p>Alumni pair up with current cohorts for accountability and pitch feedback, creating a global support circle that keeps momentum high.</p>',
    tags: ['Academy', 'Career'],
    published: true,
    publishedAt: '2025-03-15T14:00:00.000Z',
    author: 'Ifeoma James',
    authorTitle: 'Head of Talent Labs',
    readTime: '6 min read',
    heroQuote: '“The most confident freelancer is the one who practiced every tricky scenario.”',
    keyPoints: [
      'Mock client calls every Thursday with real founders.',
      'Pricing labs cover retainers, milestones, and royalties.',
      'Alumni mentors rotate monthly to keep guidance current.',
    ],
    stats: [
      { label: 'Portfolio launches', value: '120+' },
      { label: 'Avg. first contract', value: '$2,800' },
      { label: 'Countries in talent cloud', value: '22' },
    ],
  },
  {
    id: 'a16cf8f7-6c9a-4d8c-8f3c-0c7fd2148f21',
    title: 'How We Prototype AI Features in 5 Days',
    slug: 'prototype-ai-features-fast',
    excerpt:
      'A repeatable sprint framework for validating AI-powered experiences without derailing your roadmap.',
    coverUrl:
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>AI ideas fail when they stay abstract. We run a five-day prototyping sprint that moves from opportunity mapping to a working demo in front of users.</p><p>Day 1 aligns on the workflow being improved. Day 2 selects the smallest model and dataset that can prove value. By Day 4 we have a working vertical slice that testers can touch, while Day 5 is about measurement and next steps.</p><p>The result is an evidence-backed backlog: what to productionize, what to discard, and what to park for later.</p>',
    tags: ['AI', 'Product'],
    published: true,
    publishedAt: '2025-04-09T10:00:00.000Z',
    author: 'Ravi Kulkarni',
    authorTitle: 'Principal Product Strategist',
    readTime: '8 min read',
    heroQuote: '“Speed is less about the model and more about unblocking decisions.”',
    keyPoints: [
      'Start with the workflow, not the algorithm.',
      'Bias toward smallest viable dataset and model.',
      'Ship a measurable vertical slice before scaling.',
    ],
    stats: [
      { label: 'Prototypes shipped', value: '28' },
      { label: 'Median sprint length', value: '5 days' },
      { label: 'Ideas shelved early', value: '14' },
    ],
  },
  {
    id: 'f3e6d0f2-5c5c-4119-9a1f-3bd114f9f00b',
    title: 'Community-Driven Documentation That Engineers Actually Use',
    slug: 'community-driven-documentation',
    excerpt: 'How we keep docs living, trusted, and discoverable across a fast-moving product org.',
    coverUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Documentation decays when it lacks owners. We run quarterly doc jams, paired reviews, and release notes automation so engineers have a single trusted source of truth.</p><p>Living diagrams, ADRs, and onboarding paths stay current because squads earn points for each improvement. Those points convert into learning stipends, keeping contribution rewarding.</p><p>In the last quarter alone, 70% of doc updates came from engineers outside the platform team.</p>',
    tags: ['Engineering', 'Culture'],
    published: true,
    publishedAt: '2025-05-02T08:30:00.000Z',
    author: 'Sara Onyango',
    authorTitle: 'Staff Engineer, Platform',
    heroQuote: '“Docs are our product’s memory—treat them like a feature, not a chore.”',
    keyPoints: [
      'Doc jams rotate across squads with structured prompts.',
      'Automations sync release notes to guides weekly.',
      'Contribution points fund conferences and courses.',
    ],
    stats: [
      { label: 'Active contributors', value: '63' },
      { label: 'Docs updated quarterly', value: '210' },
      { label: 'Support tickets reduced', value: '31%' },
    ],
  },
  {
    id: 'd7ae1b92-22af-4f4c-9cf6-4cd4709c97d3',
    title: 'Design Ops Rituals for Calm, High-Velocity Teams',
    slug: 'design-ops-rituals',
    excerpt: 'The meeting rhythms, asset systems, and scorecards that keep designers shipping without chaos.',
    coverUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Design ops is the runway for high-performing teams. We keep weekly rituals tight: Monday planning with product, Wednesday critique, Friday system housekeeping.</p><p>Each ritual is time-boxed with clear decision owners. A shared asset library, status dashboards, and scorecards mean designers always know what “good” looks like.</p><p>As a result, PR feedback loops are faster, and handoffs to engineering are predictable.</p>',
    tags: ['Design', 'Culture'],
    published: true,
    publishedAt: '2025-05-22T12:00:00.000Z',
    author: 'Leah Benton',
    authorTitle: 'Design Operations Manager',
    readTime: '5 min read',
    heroQuote: '“Calm teams ship more because they know exactly when decisions get made.”',
    keyPoints: [
      'Three recurring rituals with tight agendas.',
      'Scorecards clarify expectations for every project.',
      'Asset systems keep dev handoffs lightweight.',
    ],
    stats: [
      { label: 'Avg. design cycle time', value: '-18%' },
      { label: 'Critique attendance', value: '96%' },
      { label: 'Design-to-dev rework', value: '-24%' },
    ],
  },
];
