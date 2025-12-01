export type MatrixKey =
  | 'team-augmentation'
  | 'mvp-development'
  | 'end-to-end-development'
  | 'offshore-development';

export interface StatHighlight {
  label: string;
  value: string;
}

export interface BenefitCard {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Offering {
  id: MatrixKey;
  badge: string;
  headline: string;
  subheadline: string;
  intro: string[];
  stats: StatHighlight[];
  benefits: BenefitCard[];
  process: ProcessStep[];
  closing: {
    title: string;
    bullets: string[];
    ctaLabel: string;
  };
}

export interface MatrixFeature {
  name: string;
  appliesTo: MatrixKey[];
}

export const heroHighlights: StatHighlight[] = [
  { label: 'Engagement models', value: '4 delivery playbooks' },
  { label: 'Tech specialists', value: '20+ senior engineers' },
  { label: 'Onboarding', value: 'Start in days, not months' },
];

export const matrixColumns = [
  { key: 'team-augmentation' as const, label: 'Team Augmentation' },
  { key: 'mvp-development' as const, label: 'MVP Development' },
  { key: 'end-to-end-development' as const, label: 'Project Development' },
  { key: 'offshore-development' as const, label: 'Offshore Development' },
];

export const featureMatrix: MatrixFeature[] = [
  {
    name: 'Access Top Industry Talent',
    appliesTo: ['team-augmentation', 'mvp-development', 'end-to-end-development', 'offshore-development'],
  },
  { name: 'Customize Solutions to Fit Your Needs', appliesTo: ['team-augmentation', 'mvp-development', 'end-to-end-development'] },
  { name: 'Expand Your Team Quickly', appliesTo: ['team-augmentation', 'offshore-development'] },
  { name: 'Prototype Your Ideas', appliesTo: ['mvp-development'] },
  { name: 'Complete End-to-End Development', appliesTo: ['end-to-end-development'] },
  { name: 'Ensure Product Scalability', appliesTo: ['end-to-end-development', 'mvp-development'] },
  { name: 'Increase Development Speed', appliesTo: ['team-augmentation', 'mvp-development', 'end-to-end-development'] },
  {
    name: 'Cost-Effective Development Solutions',
    appliesTo: ['team-augmentation', 'mvp-development', 'end-to-end-development', 'offshore-development'],
  },
];

export const offerings: Offering[] = [
  {
    id: 'team-augmentation',
    badge: 'IT Team Augmentation',
    headline: "Maximize Your Team's Potential with Premium Resources",
    subheadline:
      'Looking for top-tier IT staff augmentation services? We offer comprehensive solutions and highly skilled personnel to help you grow and strengthen your team.',
    intro: [
      'Don’t let understaffing hold you back. Maximize your team’s performance and reach your business goals with the best IT team augmentation.',
      'Team augmentation is a powerful outsourcing process that lets you expand your team with skilled professionals on an on-demand basis, without the friction of recruiting and onboarding full-time employees.',
    ],
    stats: [
      { label: 'React engineers on tap', value: '20+ specialists' },
      { label: 'Engagement start time', value: 'Under 2 weeks' },
      { label: 'Integration style', value: 'Seamless & embedded' },
    ],
    benefits: [
      {
        title: 'Interact with the Top 1% of Refined Talent',
        description:
          'Rigorous screening and extensive vetting lets you interview and select only the best developers who seamlessly integrate into your team.',
      },
      {
        title: 'Scale and Optimize Resources Quickly',
        description: 'Scale up or down at will—across roles and tech stacks—without long-term hiring overhead.',
      },
      {
        title: 'Expert Collaboration, On Demand',
        description:
          'Dedicated developers work exclusively on your project, aligning to your processes and ceremonies while adding best practices.',
      },
      {
        title: 'Cost-Effective and Transparent',
        description: 'Predictable pricing and transparent reporting lets you focus on outcomes without surprise costs.',
      },
    ],
    process: [
      { title: 'Schedule a Call', description: 'Share your goals and team needs.' },
      { title: 'Talent Requirements', description: 'Define the skills, experience levels, and timelines you need.' },
      { title: 'Contract Signing', description: 'Finalize agreements and onboarding guardrails.' },
      { title: 'Talent Allocation', description: 'We assemble your team and integrate into your workflows.' },
      { title: 'Project Continues', description: 'Continuous delivery with transparent communication and reporting.' },
    ],
    closing: {
      title: 'Let Our Expertise Help Redefine Your Business!',
      bullets: [
        'Expert teams of dedicated software developers with customized strategies',
        'Trusted technology choices for maximum impact',
        'High-security standards with transparent reporting',
        'Scalable solutions that adapt to changing requirements',
        'Cost-efficient model that maximizes productivity',
      ],
      ctaLabel: 'Hire the Best Team',
    },
  },
  {
    id: 'mvp-development',
    badge: 'MVP Development Services',
    headline: 'Boost Your Product With Expert MVP Development Services',
    subheadline:
      'Transform your vision into reality with our expert MVP software development services. We launch key software features that satisfy potential customers while balancing the project budget.',
    intro: [
      'MVP development is about quickly validating your product idea, gathering feedback from users, and iterating based on real-world insights.',
      'As a leading MVP development company, we help you identify core features and develop the product that meets your needs and goals.',
    ],
    stats: [
      { label: 'Builders available', value: '20+ MVP specialists' },
      { label: 'Engagement style', value: 'Lean & experiment-driven' },
      
    ],
    benefits: [
      { title: 'Rapid Time-to-Market', description: 'Launch your product quickly, gain user feedback, and validate early.' },
      { title: 'Risk Mitigation', description: 'Validate your product concept before making significant investments.' },
      {
        title: 'Cost Efficiency',
        description: 'Reduce risk and spend by focusing on the smallest lovable product before scaling.',
      },
      {
        title: 'Iterative Improvement',
        description: 'Continuously improve based on user insights so the final product meets expectations.',
      },
    ],
    process: [
      { title: 'Schedule a Call', description: 'Define your goals and budget guardrails.' },
      { title: 'MVP Planning', description: 'Identify the core features that deliver value quickly.' },
      { title: 'Product Design', description: 'Shape the MVP experience with a user-first lens.' },
      { title: 'Development Phase', description: 'Build in agile sprints with continuous feedback.' },
      { title: 'Launch & Iterate', description: 'Release, measure, and refine for full-scale development.' },
    ],
    closing: {
      title: 'Let Our Expertise Help Redefine Your Business!',
      bullets: [
        'Expert teams of dedicated software developers with customized strategies.',
        'Trusted technology choices for maximum impact.',
        'High-security standards with transparent reporting.',
        'Scalable solutions that adapt to changing requirements.',
        'Cost-efficient model that maximizes productivity.',
      ],
      ctaLabel: 'Build Your MVP',
    },
  },
  {
    id: 'end-to-end-development',
    badge: 'End-to-End Software Development',
    headline: 'End To End Software Development That Delivers Outstanding Solutions',
    subheadline: 'We offer a complete end-to-end software development process to launch a new product—from idea to exceptional delivery.',
    intro: [
      'End-to-end development covers every stage of creating a product, from concept to deployment.',
      'Our teams handle streamlined communication and decision-making to improve quality and efficiency across the lifecycle.',
    ],
    stats: [
      { label: 'Engineering guilds', value: '20+ cross-functional builders' },
      { label: 'Delivery coverage', value: 'Discovery to launch' },
      { label: 'Efficiency', value: 'Cohesive & cost-effective' },
    ],
    benefits: [
      {
        title: 'Access to the Top 1% of Refined Talent',
        description: "Rigorous screening and vetting ensures you're hiring top-tier talent for end-to-end software development.",
      },
      { title: 'Smooth Communication', description: 'Efficient information flow and seamless collaboration across the lifecycle.' },
      { title: 'Skip Recruitment Process', description: 'On-demand expert teams with years of experience mean you avoid hiring overhead.' },
      { title: 'Cost-Efficient', description: 'A cohesive build process reduces rework and drives long-term savings.' },
    ],
    process: [
      { title: 'Schedule a Call', description: 'Align on goals, stakeholders, and timelines.' },
      { title: 'Talent Requirements', description: 'Identify the skills and roles needed to deliver.' },
      { title: 'End-to-End Development', description: 'Execute with tailored teams to meet your project goals.' },
      { title: 'Project Continues', description: 'Integrate with your team to ensure on-time delivery and support.' },
    ],
    closing: {
      title: 'Let Our Expertise Help Redefine Your Business!',
      bullets: [
        'Expert teams of dedicated software developers with customized strategies',
        'Trusted technology choices for maximum impact',
        'High-security standards with transparent reporting',
        'Scalable solutions that adapt to changing requirements',
        'Cost-efficient model that maximizes productivity',
      ],
      ctaLabel: 'Hire The Best Team',
    },
  },
  {
    id: 'offshore-development',
    badge: 'Offshore Development Services',
    headline: 'Ready to Expand Your Offshore Office?',
    subheadline:
      'Explore boundless opportunities with customized offshore solutions that expand your reach, reduce costs, and unlock global talent.',
    intro: [
      'We help you form your offshore software development office, operating as an extension of your in-house team.',
      'By using our offshore expansion services, you can focus on core activities while we handle resources, compliance, and onboarding.',
    ],
    stats: [
      { label: 'Global talent access', value: '24/7 operations' },
      { label: 'Cost profile', value: 'Affordable without compromise' },
      { label: 'Scalability', value: 'Scale up or down seamlessly' },
    ],
    benefits: [
      { title: 'Access to Global Talent Pool', description: 'Tap into a diverse pool of skilled professionals matched to every project.' },
      { title: 'Cost Savings and Efficiency', description: 'Enjoy affordable offshore office expansion while maintaining high-quality standards.' },
      { title: 'Scalability and Flexibility', description: 'Scale with your project requirements without the hassle of hiring and firing.' },
      { title: '24/7 Operations', description: 'Teams in different time zones keep work moving and accelerate turnaround times.' },
    ],
    process: [
      { title: 'Schedule a Call', description: 'Share your offshore goals and target locations.' },
      { title: 'Talent Requirements', description: 'Define the team size, functions, and tech stack you need.' },
      { title: 'Contract Signing', description: 'Finalize commercial terms and compliance guardrails.' },
      { title: 'Talent Allocation', description: 'Deploy ready-to-go teams aligned to your plan.' },
      { title: 'Project Continues', description: 'Operate as one team with on-time delivery and shared KPIs.' },
    ],
    closing: {
      title: 'Let Our Expertise Help Expand Your Business Overseas!',
      bullets: [
        'Access top-notch professionals with years of experience',
        'Trusted technology choices for maximum impact',
        'High-security standards with transparent reporting',
        'Scalable solutions that adapt to changing requirements',
        'Cost-efficient model that maximizes productivity',
      ],
      ctaLabel: 'Hire The Best Team',
    },
  },
];

export const contactFields = ['Your name', 'Company name', 'Business mail', 'Phone number', 'About the project'];
